import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("RENTCAST_API_KEY:", process.env.RENTCAST_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { address } = req.body;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Address is required in the request body.' });
  }

  try {
    const response = await fetch(
      `https://api.rentcast.io/v1/properties/estimate-rent?address=${encodeURIComponent(address)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.RENTCAST_API_KEY as string,
        },
      }
    );
    

    const data = await response.json();
    console.log("RentCast response:", data);


    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch data from RentCast');
    }

    res.status(200).json(data);
  } catch (err: any) {
    console.error('RentCast API error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
