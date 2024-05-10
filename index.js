const express = require('express')
const port = 3000
const uuid = require('uuid')
const app = express()
const orders = []
app.use(express.json())



const checkOrderIdExists = (request, response, next) => {
    const { id } = request.params;
    const index = orders.findIndex(order => order.id === id);
    if (index < 0) {
        return response.status(404).json({ error: "Order not found" });
    }
    request.orderIndex = index

    next();
};

const logRequest = (request, response, next) => {
    console.log(`Method: ${request.method}, URL: ${request.url}`);
    next();
};

app.use(logRequest)

app.param('id', checkOrderIdExists);

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.post('/orders', (request, response) => {
    const { order, clienteName, price } = request.body

    const ordered = { id: uuid.v4(), order, clienteName, price, status: "Em Preparação" }
    

    orders.push(ordered)

    return response.status(201).json(ordered)
})

app.patch('/orders/:id', (request, response) => {
    const { id } = request.params;

    const index = orders.findIndex(order => order.id === id);

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" });
    }

       orders[index].status = "Pedido pronto";

    return response.json(orders[index]);
});


app.put('/orders/:id', (request, response) => {
    const { order, clienteName, price } = request.body;
    const index = request.orderIndex;
    const updateOrder = { id: request.params.id, order, clienteName, price, status: "Em Preparação" };
    orders[index] = updateOrder;
    return response.json(updateOrder);
})

app.delete('/orders/:id', (request, response) => {
   
    
    const index = request.orderIndex

    orders.splice(index,1)
    
    return response.status(204).json()
})





app.listen(port, () => {
    console.log(`🚀 Server started on port ${port} 🚀`)
})