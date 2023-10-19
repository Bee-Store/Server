module.exports = ({ name, email }) => {
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
              .class-header{
                  display: flex;
                  justify-content: space-between;
              }
              .receipt-info{
                  display: flex;
                  justify-content: space-between;
                  /* gap: 3em; */
              }
              .customer-info{
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
              }
              .receipt-info > div{
                  display: flex;
                  flex-direction: column;
                  gap: 20px;
              }
              .receipt-info > div:last-child{
                  direction: column;
                  gap: 8px;
              }
              .receipt-info  div:last-child > div{
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
                <span>Nairobi, kenya</span>
              </div>
            </div>
            <div>
              <span>Ship To</span>

              <div class="customer-info">
                <!-- For customer name -->
                <span>${name}</span>
                <span>Umoja</span>
                <span>Nairobi, kenya</span>
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
              <tr>
                <td>2</td>
                <td>Fridge</td>
                <td>15000</td>
                <td>30000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Iphone 12</td>
                <td>10000</td>
                <td>20000</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Hp Pavillion</td>
                <td>3000</td>
                <td>150000</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>Total</td>
                <td><strong> 302884</strong></td>
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
