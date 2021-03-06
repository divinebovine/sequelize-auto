import { Sequelize } from "sequelize";
import { initModels, Customer, Order, OrderAttributes, OrderCreationAttributes } from "./models/init-models";
import config from "./config";

class SampleApp {
  sequelize: Sequelize;
  constructor() {
    // create sequelize instance with database connection
    this.sequelize = new Sequelize(config.dbname, config.user, config.pass, config.options);
  }

  async run() {
    // load the model definitions into sequelize
    initModels(this.sequelize);

    // Customer.findAll({ where: { "country": "Germany" }}).then(rows => {
    //   console.log(rows);
    // });

    // get a customer using known values in the sample data
    const cust = await Customer.findOne({ where: { "firstName": "Hanna", "lastName": "Moos" }, include: [Order as any] });
    console.log(cust);
    if (cust == null) {
      return;
    }

    const ord = await Order.findOne({ where: { orderNumber: "542639"}});
    console.log(ord);
    console.log(await ord?.getCustomer());
    console.log(await ord?.getOrderItems());

    // make pseudo-incremental order number for demo
    const millis = new Date().getTime().toString();
    const orderNumber = "55" + millis.substring(6, 10);

    // create a new Order for the customer
    const attr: OrderCreationAttributes = {
      customerId: cust.id,
      orderDate: new Date(),
      orderNumber: orderNumber,
      totalAmount: 223.45
    };

    await Order.create(attr).then(() => {
      // display list of orders
      return Order.findAll({ where: { "customerId": cust.id } }).then(rows => {
        rows.forEach(r => console.log(r.orderNumber + " " + r.totalAmount));
      });
    });

    this.sequelize.close();
  }
}

const app = new SampleApp();
app.run();


