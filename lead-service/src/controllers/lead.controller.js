import Lead from "../models/lead.model.js";

export const createLead = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                error: "BAD_REQUEST",
                message: "The request body is empty. Please provide lead details."
            });
        }

        const { fullName, company, phone, status, notes, nextFollowUp } = req.body;

        if (!fullName || fullName.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: "VALIDATION_ERROR",
                message: "Missing mandatory field: fullName",
                field: "fullName"
            });
        }
        
        const lead= new Lead({
            fullName: fullName.trim(),
            company: company?.trim() || "",
            phone: phone?.trim() || "",
            userId : req.user.userId,
            status: status || "New",
            nextFollowUp: nextFollowUp || null,
            notes: notes ? (Array.isArray(notes) ? notes : [notes]) : []
        });

        await lead.save();

        return res.status(201).json({
            success: true,
            message: "Lead created successfully",
            data: lead
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: "SCHEMA_VALIDATION_ERROR",
                message: messages
            });
        }


        console.error(`[LeadService][CreateLead][Critical]: ${error}`);
        return res.status(500).json({
            success: false,
            // error: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred on the server.",
            error
        });
    }
};


export const getLeads = async (req, res) => {
    try {
        const { search, status } = req.query;

        let baseQuery = { userId: req.user.userId };

        if (status) baseQuery.status = status;

        if (search) {
            baseQuery.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const allLeadsRaw = await Lead.find(baseQuery).sort({ createdAt: -1 });

        const allLeads = allLeadsRaw.map((lead) => ({
            ...lead.toObject(),
            notes: lead.notes.sort(
                (a, b) =>
                new Date(b.date) -
                new Date(a.date)
            ),
        }));

        const todayLeadsRaw = await Lead.find({
            ...baseQuery,
            nextFollowUp: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ createdAt: -1 });

        const todayLeads = todayLeadsRaw.map((lead) => ({
            ...lead.toObject(),
            notes: lead.notes.sort(
                (a, b) =>
                new Date(b.date) -
                new Date(a.date)
            ),
        }));

        return res.status(200).json({
            success: true,
            count: allLeads.length,
            todayCount: todayLeads.length,
            todayLeads,
            data: allLeads
        });

    } catch (error) {
        console.error(`[LeadService][GetLeads][Error]: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve leads."
        });
    }
};


export const updateLead = async (req, res) => {
    try {
        const { leadId, status, nextFollowUp, newNote } = req.body;
        const lead = await Lead.findOne({ _id: leadId, userId: req.user.userId });

        if (!lead) {
            return res.status(404).json({
                success: false,
                error: "NOT_FOUND",
                message: "Lead not found or you don't have permission to edit it."
            });
        }

        let updateData = {};
        if (status) updateData.status = status;
        if (nextFollowUp) updateData.nextFollowUp = nextFollowUp;

        let updateQuery = { $set: updateData };
        
        if (newNote && newNote.trim() !== "") {
            updateQuery.$push = { 
                notes: { 
                    description: newNote, 
                    date: new Date() 
                } 
            };
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            leadId,
            updateQuery,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            data: updatedLead
        });

    } catch (error) {
        console.error(`[LeadService][UpdateLead][Error]: ${error.message}`);
        return res.status(500).json({
            success: false,
            error: "INTERNAL_SERVER_ERROR",
            message: "Failed to update lead details."
        });
    }
};


export const deleteLead = async (req, res) => {
    try {
        const { leadId } = req.body;
        const deletedLead = await Lead.findOneAndDelete({ 
            _id: leadId, 
            userId: req.user.userId 
        });

        if (!deletedLead) {
            return res.status(404).json({
                success: false,
                error: "NOT_FOUND",
                message: "Lead not found or you are not authorized to delete it."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
            deletedId: leadId
        });

    } catch (error) {
        console.error(`[LeadService][DeleteLead][Error]: ${error.message}`);

        return res.status(500).json({
            success: false,
            error: "INTERNAL_SERVER_ERROR",
            message: "An error occurred while trying to delete the lead."
        });
    }
};