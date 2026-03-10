const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  let body;
  const contentType = event.headers['content-type'] ?? '';
  try {
    if (contentType.includes('application/json')) {
      body = JSON.parse(event.body);
    } else {
      // URL-encoded form submission (native browser POST)
      body = Object.fromEntries(new URLSearchParams(event.body));
    }
  } catch {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ success: false, error: 'Could not parse request body' }),
    };
  }

  // Extract control fields
  const base = body._base;
  const table = body._table;

  if (!base || !table) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ success: false, error: 'Missing _base or _table' }),
    };
  }

  if (!AIRTABLE_API_KEY) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ success: false, error: 'Server misconfiguration' }),
    };
  }

  // Strip all _ prefixed control fields, pass the rest to Airtable
  const fields = Object.fromEntries(
    Object.entries(body).filter(([key]) => !key.startsWith('_'))
  );

  let airtableRes;
  try {
    airtableRes = await fetch(`https://api.airtable.com/v0/${base}/${table}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });
  } catch (err) {
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ success: false, error: 'Failed to reach Airtable' }),
    };
  }

  if (!airtableRes.ok) {
    const detail = await airtableRes.json().catch(() => ({}));
    return {
      statusCode: airtableRes.status,
      headers: cors,
      body: JSON.stringify({ success: false, error: detail?.error?.message ?? 'Airtable error' }),
    };
  }

  const created = await airtableRes.json();
  return {
    statusCode: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, id: created.id }),
  };
};
