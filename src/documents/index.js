module.exports = (name, tempCart) => {
  // Calculate the total amount
  const totalAmount = tempCart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const productRows = tempCart
    .map(
      (item) => `
    <tr>
      <td>${item.quantity}</td>
      <td>${item.product.name}</td>
      <td>${item.product.price}</td>
      <td>${item.product.price * item.quantity}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
          <style>
             .receipt-wrapper {
                display: flex;
                flex-direction: column;
                padding: 2em 4em !important;
                gap: 4em;
              }
              .class-header {
                  display: flex;
                  justify-content: space-between;
              }
              .receipt-info {
                  display: flex;
                  justify-content: space-between;
              }
              .customer-info {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
              }
              .receipt-info > div {
                  display: flex;
                  flex-direction: column;
                  gap: 20px;
              }
              .receipt-info > div:last-child {
                  direction: column;
                  gap: 8px;
              }
              .receipt-info div:last-child > div {
                  display: flex;
                  gap: 10px;
              }
          </style>
       </head>
       <body>
        <div class="receipt-wrapper">
          <div class="class-header">
            <span>BeeKissed ltd</span>
            <span>RECEIPT</span>
          </div>

          <div class="receipt-info">
            <div>
              <span>Bill To</span>
              <div class="customer-info">
                <!-- For customer name -->
                <span>${name}</span>
                <span>Umoja</span>
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            <div>
              <span>Ship To</span>
              <div class="customer-info">
                <!-- For customer name -->
                <span>${name}</span>
                <span>Umoja</span>
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            <div>
              <div>
                <span> Receipt# </span>
                <!-- For Receipt ID -->
                <span>US-001</span>
              </div>
              <div>
                <span>Receipt Date</span>
                <!-- For Receipt Date -->
                <span>11/02/2019</span>
              </div>
              <div>
                <span>Due Date</span>
                <!-- For Receipt Due Date -->
                <span>26/02/2019</span>
              </div>
            </div>
          </div>
          <!-- Table showing all purchased items -->
          <table>
            <thead>
              <tr>
                <th>QTY</th>
                <th>DESCRIPTION</th>
                <th>UNIT PRICE</th>
                <th>AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
              <tr>
                <td></td>
                <td></td>
                <td>Total</td>
                <td><strong>${totalAmount}</strong></td>
              </tr>
            </tbody>
          </table>
          <div>
            <h3>Terms & Conditions Apply</h3>
            <span>Thank you ${name}</span>
          </div>
        </div>
       </body>
    </html>
  `;
};
