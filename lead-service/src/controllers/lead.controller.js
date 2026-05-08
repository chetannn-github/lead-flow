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