# The Findlay Card Show Website

This is a completed static one-page website for The Findlay Card Show.

## Open the Site

Open `index.html` in a browser.

## Update Event Details

Most editable event details are in `script.js` inside the `SITE_CONFIG` object:

- `showTime`
- `admissionPrice`
- `tablePrice`
- `tablePriceNumeric`
- `availableTables`
- `vendorSetupTime`
- `contactEmail`
- `facebookEventLink`
- `paymentLink`
- `refundPolicy`

Replace placeholder values such as `[Show Time]`, `[Vendor Table Price]`, and `[Contact Email]` when final details are available.

## Payment Setup

Set `paymentLink` in `script.js` to a Stripe, Square, PayPal, or other checkout URL. When a real `https://` link is added, the reservation form will open that checkout page after submission.

## Vendor Reservations

The demo reservation form stores submissions in the visitor's browser using local storage and provides a host notification email link. For production, connect the form to a backend service, form provider, or payment platform webhook so vendor data is stored centrally and confirmation emails can be sent automatically.

## Map and Directions

The location section includes an embedded Google Map and a Google Maps directions link for:

Hancock County Fairgrounds  
1017 E Sandusky St  
Findlay, OH 45839
