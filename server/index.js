const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const upload = require('multer')();
var date = new Date();

// App shit
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/expenses');
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    data: [
        {
            month: String,
            expenses: Array,
            index: {
                total: Number,
                sections: Array,
                categories: Array,
                owe: Array,
                lend: Array,
                credit_history: Array
            }
        }
    ]
})
const User = mongoose.model('user', userSchema);

// TO DO

var addOweLend = function (ls,info){
    return new Promise(async (res, rej)=>{
        const name = info.name;
        const month_index = info.monthIndex;
        var count = 0;

        let promise = new Promise((res,rej)=>{
            User.findOne({name: name}).then((user)=>{
                let newData = user.data;
                ls.map(async(single)=>{
                    const lender = single.lender;    //
                    const subject = single.subject;  //
                    const amount = single.amount;    //
                    const type = single.type;        //
                    const obj = {subject: subject, amount: parseInt(amount), time: date.toString()};
                    const newObj =  {name: lender, amount: parseInt(amount), info: []};
                    newObj.info.push(obj);

                    if(type==='0'){
                        let found = false;
                        newData[month_index].index.owe.map((single)=>{
                            if(single.name===lender){
                                const final = parseInt(single.amount) + parseInt(amount);
                                single.amount = final;
                                found = true;
                                single.info.push(obj);
                            }
                        })
                        if (found===false){
                            console.log("NEWNAMEFOUND") //
                            newData[month_index].index.owe.push(newObj);
                        }
                        
                    }else if(type==='1'){
                        let found = false;
                        newData[month_index].index.lend.map((single)=>{
                            if(single.name===lender){
                                const final = parseInt(single.amount) + parseInt(amount);
                                single.amount = final;
                                found = true;
                                single.info.push(obj);
                            }
                        })
                        if (found===false){
                            newData[month_index].index.lend.push(newObj);
                        }
                    }else{
                        console.log("Gadbad ho gai");
                    }
                    count+=1;
                    if (count===ls.length){
                        res(newData);
                    }
                })
            });
        });
        newData = await promise;
        res(newData);
    })
}

app.route("/")
    .get(async (req,res) => {
        // Viewing the database
        const items = await User.find();
        res.send(items);
    })
    .post((req,res)=>{
        // Creating new account

        const name = req.body.name;
        const pass = req.body.password;
        const account = req.body.account;
        
        console.log("reached here");
        const month = date.getMonth() + " " + date.getFullYear();
        console.log(month);
        const obj = {
            name: name,
            password: pass,
            data: [
                    {
                        month: month,
                        expenses: [],
                        index: {
                            total: account,
                            sections: [],
                            categories: ["Food", "Academics"],
                            owe: [],
                            lend: [],
                            credit_history: []
                        }
                    }
                ]
        };
        const newUser = new User(obj);
        newUser.save();
    })

app.route("/addmonth")
    .post((req,res)=>{
        const name = req.body.name;
        const date = req.body.date;

        User.findOne({name: name}).then((user)=>{
            console.log(user);
            let newData = user.data;
            const obj = {
                index: {
                    total: 0,
                    sections: [],
                    categories: ["Food", "Academics"],
                    owe: [],
                    lend: [],
                    credit_history: []
                },
                month: date,
                expenses: []
            }
            newData.push(obj);
            console.log(newData);
            const set = {data: newData};
            User.updateOne({name: name}, {$set:{data: newData}}).then((res)=>{
                console.log(res);
            });
        });

        
        
    })

app.route("/addexpense")
    .post(async (req,res) => {
        // Adding expense
        const category = req.body.category;
        const subject = req.body.subject;
        const input = Object.values(req.body.input);
        const splitNames = Object.values(req.body.splitNames);
        const name = req.body.name;
        const month_index = req.body.monthIndex;
        const expense_date = date.toString();
        const info = [];
        var oweList = [];
        var owe_info = {name: name, monthIndex: month_index};
        var owe_money = 0;
        
        splitNames.map((single)=>{
            const obj = {lender: single.name, subject: subject, amount: single.amount, type: '1'};
            owe_money+=single.amount;
            oweList.push(obj);
            
        })

        addOweLend(oweList, owe_info).then((newData)=>{
            console.log(newData[month_index].index.lend);
            User.findOneAndUpdate({name:name}, {$set:{data: newData}}).then((user)=>{
                console.log("Done");
            });
        })

        let amount = 0;
        input.map((inp)=>{
            amount+=parseInt(inp.amount);
            const obj = {section: inp.section, amount: inp.amount};
            info.push(obj);
        })
        amount-=owe_money;
        const expense = {subject: subject, amount: amount, category: category, date: expense_date, info: info};
        console.log(input);
        let promise = new Promise((resolve, reject) => {
            User.findOne({name: name}).then((user)=>{
                const newData = user.data;
                newData[month_index].expenses.push(expense);                
                const prevMoney = newData[month_index].index.total;
                const final = prevMoney - amount;
                newData[month_index].index.total = final;
                info.map((inp)=>{
                    const section = inp.section;
                    const section_amount = inp.amount;
                    newData[month_index].index.sections.map((each_section)=>{            
                        if(each_section.name===section){
                            const final = each_section.amount - section_amount;
                            each_section.amount = final;
                        }
                    })
                })
                
                console.log(newData[month_index].index.sections);
                resolve(newData);
            })
        })    
        const newData = await promise;
        const set = {data: newData};
        User.findOneAndUpdate({name:name},{$set:set}).then((user)=> {
            console.log("Done");
        });
    })

app.route("/addmoney")
    .post(async (req,res) => {
        // Adding Money

        const senderName = req.body.senderName;
        const to = req.body.to;
        const amount = req.body.amount;
        const name = req.body.name;
        const month_index = req.body.monthIndex;
        const credit = {sender: senderName,to: to, amount: amount};
        let promise = new Promise( (resolve,reject) => {
            User.findOne({name: name}).then((user)=>{
                var newData = user.data;
                newData[month_index].index.credit_history.push(credit);
                const money = newData[month_index].index.total;
                const final = parseInt(money) + parseInt(amount);
                newData[month_index].index.total = final;
                newData[month_index].index.sections.map((each_section)=>{
                    if(each_section.name===to){
                        const final = parseInt(each_section.amount) + parseInt(amount);
                        each_section.amount = final;
                    }
                })
                resolve(newData);
        })})
        
        const newData = await promise;
        const set = {data : newData};
        console.log(newData[month_index].index.sections)
        User.findOneAndUpdate({name:name},{$set:set}).then((user)=> {
            console.log("done");
        });
    })

app.route("/addsection")
    .post(async (req,res) => {
        const name = req.body.name;
        const sectionName = req.body.sectionName;
        const amount = req.body.amount;
        const month_index = req.body.monthIndex;
        const section = {name: sectionName, amount: parseInt(amount)}
        console.log(req.body);

        let promise = new Promise((resolve, reject) => {
            User.findOne({name: name}).then((user)=>{
                const newData = user.data;
                const total = newData[month_index].index.total;
                const final = total - amount;
                const len = newData[month_index].index.sections.length;
                if(len===0){
                    newData[month_index].index.sections.push({name: "remainder", amount: final});
                }
                else{
                    const init = newData[month_index].index.sections[0].amount;
                    newData[month_index].index.sections[0].amount = init - amount;
                }
                newData[month_index].index.sections.push(section);
                resolve(newData);
            });
        })
        
        const newData = await promise;
        console.log(newData[0].index.sections);
        const set = {data : newData};
        User.findOneAndUpdate({name: name},{$set:set}).then((res)=>{
            console.log(res.data[0].index);
        });
    })

app.route("/addcategory")
    .post(async (req,res) => {
        const name = req.body.name;
        const month_index = req.body.monthIndex;
        const categoryName = req.body.categoryName;

        let promise = new Promise((resolve,reject)=>{
            User.findOne({name: name}).then((user)=> {
                
                const newData = user.data;
                console.log(month_index);
                console.log(newData[month_index].index);
                newData[month_index].index.categories.push(categoryName);
                resolve(newData);
            })
        })
        const newData = await promise;
        User.findOneAndUpdate({name: name}, {$set: {data: newData}}).then(()=>{
            console.log("Category Added.");
        })
    })

app.route("/addowelend")
    .post(async(req, res)=>{
        
        const name = req.body.name;
        const month_index = req.body.monthIndex;
        const lender = req.body.lender;    
        const subject = req.body.subject;  
        const amount = req.body.amount;    
        const type = req.body.type;        

        const ls = [{lender: lender, subject: subject, amount: amount, type: type}];
        const info = {name: name, monthIndex: month_index};

        addOweLend(ls, info).then((newData)=>{
            console.log(newData);
            User.findOneAndUpdate({name:name}, {$set:{data: newData}}).then((value)=>{
                console.log(value.data[month_index].index)
            });
        })
    })


app.listen(3100,()=>{
    console.log("Server is up and running on port 3100..");
})
