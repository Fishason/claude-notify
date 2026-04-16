async function request(workerUrl, path, method, body) {
  const url = `${workerUrl}${path}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const data = await res.json();
  return { status: res.status, data };
}

async function register(workerUrl, { machine_id, notify_token, machine_name }) {
  return request(workerUrl, "/api/register", "POST", {
    machine_id,
    notify_token,
    machine_name,
  });
}

async function notify(workerUrl, { machine_id, notify_token, cwd, session_name }) {
  return request(workerUrl, "/api/notify", "POST", {
    machine_id,
    notify_token,
    cwd,
    session_name,
  });
}

async function status(workerUrl, machineId) {
  return request(workerUrl, `/api/status?id=${machineId}`, "GET");
}

async function toggle(workerUrl, { machine_id, notify_token, active }) {
  return request(workerUrl, "/api/toggle", "POST", {
    machine_id,
    notify_token,
    active,
  });
}

module.exports = { register, notify, status, toggle };
