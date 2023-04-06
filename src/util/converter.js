import csv from 'csvtojson';

csv().fromFile("../demo_data/listings.csv")
  .then((jsonArrayObj) => {
    console.log(jsonArrayObj);
  });
