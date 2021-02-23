// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.options('*', cors());
const stripe = require('stripe')('sk_test_51INbAZBqwn3VfOGXXbgUT7qx3NfDby66prbM4t3fzHCmWZxPvl4vrzHeBl00rbiCLs6g2TdD5CFJOdqyko6ypUsN00ptbpaZGC')

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://www.google.com/',
    cancel_url: 'https://www.youtube.com/',
  });

  console.log("session:", session);

  res.json({ id: session.id });
});

// Match the raw body to content type application/json
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (request, response) => {
  let event;

  try {
    event = JSON.parse(request.body);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("event", event);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
});
app.listen(4242, () => console.log(`Listening on port ${4242}!`));