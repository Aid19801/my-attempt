// pull in the data
d3.queue()
  .defer(d3.json, "http://localhost:3000/data")
  .defer(d3.json, "http://localhost:3001/data")
  .await((err, balances, accDetails) => {
    console.log("err", err);
    console.log("balances", balances);
    console.log("accDetails", accDetails);
    var updatedData = balances.map((balanceObject) => {
      balanceObject.accountName = accDetails.filter(
        (each) => each.accNumber === balanceObject.accNumber
      )[0].accName;
      return balanceObject;
    });
    console.log("updatedData", updatedData);
  });

// hook onto SVG

// draw scales

// draw elements

// update elements
