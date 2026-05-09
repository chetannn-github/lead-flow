async function handleRes(res) {
  try {
    const result = await res.json();
    return result;
  } catch (error) {
    
  }
  
}


async function get(BASE_URL, path,token,params={}) {
  const headers = {}
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const url = new URL(BASE_URL + path);
  
  if (Object.keys(params).length > 0) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });
  }
  const res = await fetch(url.toString(), { headers })
  return await handleRes(res)
}

async function post(BASE_URL, path, body, token) {
  console.log(BASE_URL, "BASE URL")
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'POST', headers, body: JSON.stringify(body)})
  return await handleRes(res)
}

async function put(BASE_URL,path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'PUT', headers, body: JSON.stringify(body) })
  return await handleRes(res)
}

async function del(BASE_URL, path, body, token ) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'DELETE', headers, body : JSON.stringify(body)})
  return await handleRes(res)
}


async function patch(BASE_URL, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  const res = await fetch(BASE_URL + path, { method: 'PATCH', headers, body: JSON.stringify(body)})
  return await handleRes(res)
}

export default { get, post, patch , del, put}