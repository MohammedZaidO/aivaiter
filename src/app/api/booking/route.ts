import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const payload = {
      timestamp: new Date().toISOString(),
      ...data,
      source: data.source || "AIVaiter demo"
    };

    /*
     * =========================================
     * GOOGLE SHEETS / MAKE.COM WEBHOOK INTEGRATION
     * =========================================
     * To capture bookings in a spreadsheet:
     * 1. Create a webhook endpoint in Zapier, Make.com, or Google Apps Script.
     * 2. The script should expect POST JSON data (timestamp, customer name, phone, date, time, guests, special request, source).
     * 3. Set the GOOGLE_SHEET_WEBHOOK_URL variable in your .env.local file to that endpoint.
     * =========================================
     */
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Failed to POST to Google Sheet Webhook:", err);
      }
    } else {
      console.log("\n====== NEW BOOKING LEAD ======");
      console.log(JSON.stringify(payload, null, 2));
      console.log("==============================\n");
    }

    return NextResponse.json({ success: true, message: "Booking captured." });

  } catch (error) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ success: false, message: "Error capturing booking." }, { status: 500 });
  }
}
