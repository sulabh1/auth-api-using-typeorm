import { createConnection } from "typeorm";
import faker from "faker"
import { Product } from "../entity/Product";

createConnection().then(async con => {
    const productRepo = con.getRepository(Product)

    for (let i = 0; i < 50; i++) {
        await productRepo.save({
            title: faker.lorem.words(2),
            description: faker.lorem.words(10),
            image: faker.image.imageUrl(),
            price: faker.datatype.number(100)
        })
    }
    process.exit()
})