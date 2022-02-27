require('dotenv').config();
import { PrismaClient } from "@prisma/client";
import express from "express";
const cors = require("cors");
var bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use(cors({
    origin: "*",
}));

app.get('/', async (req, res) => {
    res.json({
        message: 'Hello World'
    });
})

app.get("/getlabs", async (req, res) => {
    const result = await prisma.lab.findMany();
    res.json({ result });
});

// DASHBOARD QUERIES
app.get("/dashboardtests/:number", async (req, res) => {
    const { number } = req.params;
    const num = parseInt(number);
    try {
        const result = await prisma.test.findMany({
            take: num,
        })
        res.json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, message: err });
    }
})

app.get("/dashboardlabs/:number", async (req, res) => {
    const { number } = req.params;
    const num = parseInt(number);
    try {
        const result = await prisma.lab.findMany({
            take: num,
        })
        res.json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, message: err });
    }
})

app.post('/signupuser', async (req, res) => {
    const { name, email, password, username } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                username
            }
        });
        res.json({ success: true, result: result });
    } catch (error) {
        res.json({ success: false, error: error });
    }
})


app.post("/booktest/:labid/:testid", async (req, res) => {
    const { labid, testid } = req.params;
    const labId = parseInt(labid);
    const testId = parseInt(testid);
    const { name, email, phone, address, age, gender, bloodGroup, Height, weight, userId } = req.body;
    try {
        const data = await prisma.userTestBooked.create({
            data: {
                bookedAt: String(new Date(new Date().getTime())),
                bookedFor: capitalize(name),
                labId,
                testId,
                User: {
                    connect: {
                        userId: userId
                    }
                },
                patients: {
                    create: {
                        name,
                        email,
                        phone,
                        address,
                        age,
                        gender,
                        bloodGroup,
                        Height,
                        weight
                    }
                }
            }
        });
        res.json({ success: true, result: data });
    }
    catch (err) {
        res.json({ success: false, message: err });
    }
})

app.get("/gettest/:labid/:testid", async (req, res) => {
    const { labid, testid } = req.params;
    const labId = parseInt(labid);
    const testId = parseInt(testid);
    try {
        const result = await prisma.userTestBooked.findMany({
            where: {
                labId: labId,
                testId: testId
            },
            include: {
                patients: true
            }
        })
        res.json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, message: err });
    }
})

app.get("/gettestforlab/:testid", async (req, res) => {
    const { testid } = req.params;
    const testId = parseInt(testid);
    try {
        const result = await prisma.userTestBooked.findMany({
            where: {
                testId: testId
            },
            include: {
                patients: true
            }
        })
        res.json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, message: err });
    }
})

app.get('/gettest/:userid', async (req, res) => {
    const { userid } = req.params;
    const userId = parseInt(userid);
    try {
        const result = await prisma.userTestBooked.findMany({
            where: {
                userId: userId
            },
            include: {
                patients: true
            }
        })
        res.json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, message: err });
    }
})

app.get('/alltestbooked', async (req, res) => {
    try {
        const result = await prisma.userTestBooked.findMany();
        res.json({ success: true, result: result });
    }
    catch (err) {
        res.json({ success: false, message: err });
    }
})

app.post(`/signuplabs`, async (req, res) => {
    const { labName, email, password, labImage, location, certificateNo, phone, } = req.body;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const addLab = await prisma.lab.create({
        data: {
            labName,
            email,
            password: hashedPassword,
            labImage,
            location,
            certificateNo,
            phone
        }
    })

    res.json(addLab);
});

app.get('/lablogin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.lab.findMany({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.json({ success: false, error: "Invalid email" });
        }
        const valid = await bcrypt.compare(password, user[0].password);
        if (!valid) {
            return res.json({ success: false, error: "Invalid password" });
        }
        res.json({ success: true, user: user });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.post('/lablogin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.lab.findMany({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.json({ success: false, error: "Invalid email" });
        }
        const valid = await bcrypt.compare(password, user[0].password);
        if (!valid) {
            return res.json({ success: false, error: "Invalid password" });
        }
        res.json({ success: true, user: user });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.get('/userlogin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findMany({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.json({ success: false, error: "Invalid email" });
        }
        const valid = await bcrypt.compare(password, user[0].password);
        if (!valid) {
            return res.json({ success: false, error: "Invalid password" });
        }
        res.json({ success: true, user: user });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.post('/userlogin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findMany({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.json({ success: false, error: "Invalid email" });
        }
        const valid = await bcrypt.compare(password, user[0].password);
        if (!valid) {
            return res.json({ success: false, error: "Invalid password" });
        }
        res.json({ success: true, user: user });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.post(`/addlabtests`, async (req, res) => {
    const { testName, testPrice, testDescription, homeCollection, labTestId, testImage } = req.body;
    try {
        const addTest = await prisma.test.create({
            data: {
                testName,
                testPrice,
                testDescription,
                homeCollection,
                testImage,
                lab: {
                    connect: {
                        labId: labTestId
                    }
                }
            }
        })
        console.log(addTest);
        res.json({ success: true, result: addTest });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
});

app.get('/getalltest', async (req, res) => {
    const result = await prisma.test.findMany();
    res.json({ success: true, result: result });
})

app.get('/getalluser', async (req, res) => {
    const result = await prisma.user.findMany();
    res.json({ success: true, result: result });
})

app.get('/getalluser/:id', async (req, res) => {
    const id = req.params.id;
    const reqId = parseInt(id);
    try {
        const result = await prisma.user.findMany({
            where: {
                userId: reqId,
            }
        });
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.get('/getalltest/:id', async (req, res) => {
    const { id } = req.params;
    // convert id to number
    const reqId = parseInt(id);
    try {
        const result = await prisma.test.findMany({
            where: {
                lab: {
                    labId: reqId
                }
            }
        })
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

function capitalize(word: string): string {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
}

app.post('/search/:test', async (req, res) => {
    const { test } = req.params;
    const newTest = capitalize(test);
    const capTest = test.toUpperCase();
    console.log(test, newTest, capTest);
    try {
        const result = await prisma.test.findMany({
            where: {
                OR: [
                    { testName: { contains: newTest } },
                    { testDescription: { contains: newTest } },
                    { testName: { equals: newTest } },
                    { testDescription: { equals: newTest } },
                    { testName: { endsWith: newTest } },
                    { testDescription: { endsWith: newTest } },
                    { testName: { contains: test } },
                    { testDescription: { contains: test } },
                    { testName: { equals: test } },
                    { testDescription: { equals: test } },
                    { testName: { endsWith: test } },
                    { testDescription: { endsWith: test } },
                    { testName: { contains: capTest } },
                    { testDescription: { contains: capTest } },
                    { testName: { equals: capTest } },
                    { testDescription: { equals: capTest } },
                    { testName: { endsWith: capTest } },
                    { testDescription: { endsWith: capTest } }
                ]
            }
        })
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.get('/search/:test', async (req, res) => {
    const { test } = req.params;
    try {
        const result = await prisma.test.findMany({
            where: {
                testName: {
                    contains: test
                }
            }
        });
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

// UPDATION ROUTES

app.put('/updateuser/:userId', async (req, res) => {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);
    const { name, email, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await prisma.user.update({
            where: {
                userId: userIdNum,
            },
            data: {
                name,
                email,
                password: hash
            }
        });
        res.json({ success: true, result: result });
    } catch (error) {
        res.json({ success: false, error: error });
    }
})

app.put('/updatelab/:labid', async (req, res) => {
    const { labid } = req.params;
    const labidNum = parseInt(labid);
    const { labName, email, password, labImage, location, certificateNo, phone } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await prisma.lab.update({
            where: {
                labId: labidNum,
            },
            data: {
                labName,
                email,
                password: hash,
                labImage,
                location,
                certificateNo,
                phone
            }
        });
        res.json({ success: true, result: result });
    } catch (error) {
        res.json({ success: false, error: error });
    }
})

app.put('/updatetest/:testid', async (req, res) => {
    const { testid } = req.params;
    const testidNum = parseInt(testid);
    const { testName, testPrice, testDescription, homeCollection, labTestId, testImage } = req.body;
    try {
        const result = await prisma.test.update({
            where: {
                testId: testidNum,
            },
            data: {
                testName,
                testPrice,
                testDescription,
                homeCollection,
                testImage,
                lab: {
                    connect: {
                        labId: labTestId
                    }
                }
            }
        });
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

// DELETION ROUTES

app.delete('/deletelab/:labid', async (req, res) => {
    const { labid } = req.params;
    const labidNum = parseInt(labid);
    try {
        const result = await prisma.lab.delete({
            where: {
                labId: labidNum,
            }
        });
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.delete('/deletetest/:testid', async (req, res) => {
    const { testid } = req.params;
    const testidNum = parseInt(testid);
    try {
        const result = await prisma.test.delete({
            where: {
                testId: testidNum,
            }
        });
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

app.delete('/deleteuser/:userid', async (req, res) => {
    const { userid } = req.params;
    const useridNum = parseInt(userid);
    try {
        const result = await prisma.user.delete({
            where: {
                userId: useridNum,
            }
        });
        res.json({ success: true, result: result });
    }
    catch (error) {
        res.json({ success: false, error: error });
    }
})

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Server ready at port: ${port}`);
});