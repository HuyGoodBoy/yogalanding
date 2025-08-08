Supabase schema and VNPay integration guide

1) Apply schema
- Open Supabase SQL editor and run `schema.sql`.
- Optionally run `seed.sql` to create demo courses.

2) Auth
- Uses Supabase Auth (email/password, OAuth). `profiles` row is auto-created via trigger `handle_new_user`.

3) Core tables
- `courses`: course catalog
- `orders` + `order_items`: shopping cart/order
- `payments`: payment records (VNPay IPN/return)
- `enrollments`: user course ownership

4) Order flow (client)
- Call RPC `create_order(course_ids uuid[], client_return_url text)` to create an order.
- From your server (Netlify function/Express), create VNPay payment URL using order_id and total_amount from the order, then redirect user.

5) VNPay integration (server)
Create an Edge Function/Server endpoint with the Supabase service key. Pseudo-steps:

```ts
// 1) After user chooses course(s)
// POST /api/checkout -> returns VNPay redirect URL
// - Read order by id, compute vnp_Amount, generate vnp_SecureHash, redirect.

// 2) VNPay Return URL (user browser) & IPN URL (server-to-server)
// Validate secure hash. If valid and success code, call the SQL function below with service role:
await supabaseAdmin.rpc('mark_order_paid', {
  p_order_id: orderId,
  p_provider: 'vnpay',
  p_transaction_no: vnp_TransactionNo,
  p_bank_code: vnp_BankCode,
  p_pay_date: new Date(parsePayDate(vnp_PayDate)),
  p_amount_vnd: Number(vnp_Amount) / 100,
  p_signature_valid: true,
  p_raw: payloadJson
});
```

The SQL function `mark_order_paid` will:
- Insert a row into `payments`.
- Update `orders.status` -> `paid` (when signature valid).
- Grant `enrollments` for all `order_items` to the `user_id` of the order.

6) Policies
- Public can read `courses`.
- Users can see their own `orders`, `order_items`, `payments`, `enrollments`.
- Admin (profiles.role = 'admin') can manage content.

7) Notes
- Always verify VNPay signature for both Return and IPN. Only trust IPN or your server-side verification to call `mark_order_paid`.
- Amount in VNPay is in VND*100; the schema stores pure VND.


