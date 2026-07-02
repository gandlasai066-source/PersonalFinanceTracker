// ======================================
// PERSONAL FINANCE TRACKER PRO
// ======================================

const form = document.getElementById("expenseForm");
const transactionList = document.getElementById("transactionList");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const savings = document.getElementById("savings");

const search = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

const themeBtn = document.getElementById("themeBtn");

const toast = document.getElementById("toast");

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let pieChart;
let barChart;

// ======================================
// SAVE DATA
// ======================================

function saveData(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}

// ======================================
// TOAST
// ======================================

function showToast(message){

    toast.innerText = message;

    toast.style.display="block";

    setTimeout(()=>{

        toast.style.display="none";

    },2000);

}

// ======================================
// LOAD TRANSACTIONS
// ======================================

function loadTransactions(){

    transactionList.innerHTML="";

    let totalIncome=0;

    let totalExpense=0;

    transactions.forEach((item,index)=>{

        if(item.type==="Income"){

            totalIncome+=Number(item.amount);

        }

        else{

            totalExpense+=Number(item.amount);

        }

        const row=document.createElement("tr");

        row.innerHTML=`

        <td>${item.title}</td>

        <td>₹${item.amount}</td>

        <td>${item.type}</td>

        <td>${item.category}</td>

        <td>${item.date}</td>

        <td>

        <button
        class="edit-btn"
        onclick="editTransaction(${index})">

        Edit

        </button>

        <button
        class="delete-btn"
        onclick="deleteTransaction(${index})">

        Delete

        </button>

        </td>

        `;

        transactionList.appendChild(row);

    });

    balance.innerHTML="₹"+(totalIncome-totalExpense);

    income.innerHTML="₹"+totalIncome;

    expense.innerHTML="₹"+totalExpense;

    savings.innerHTML="₹"+(totalIncome-totalExpense);

}
// ======================================
// ADD TRANSACTION
// ======================================

form.addEventListener("submit",(e)=>{

e.preventDefault();

const title=document.getElementById("title").value;

const amount=document.getElementById("amount").value;

const type=document.getElementById("type").value;

const category=document.getElementById("category").value;

const date=document.getElementById("date").value;

transactions.push({

title,

amount,

type,

category,

date

});

saveData();

loadTransactions();

updateCharts();

form.reset();

showToast("Transaction Added Successfully");

});
// ======================================
// DELETE TRANSACTION
// ======================================

function deleteTransaction(index){

    if(confirm("Delete this transaction?")){

        transactions.splice(index,1);

        saveData();

        loadTransactions();

        updateCharts();

        showToast("Transaction Deleted");

    }

}

// ======================================
// EDIT TRANSACTION
// ======================================

function editTransaction(index){

    const item=transactions[index];

    document.getElementById("title").value=item.title;

    document.getElementById("amount").value=item.amount;

    document.getElementById("type").value=item.type;

    document.getElementById("category").value=item.category;

    document.getElementById("date").value=item.date;

    transactions.splice(index,1);

    saveData();

    loadTransactions();

    updateCharts();

}

// ======================================
// SEARCH
// ======================================

search.addEventListener("keyup",()=>{

    const value=search.value.toLowerCase();

    const rows=document.querySelectorAll("#transactionList tr");

    rows.forEach(row=>{

        row.style.display=row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });

});

// ======================================
// CATEGORY FILTER
// ======================================

categoryFilter.addEventListener("change",()=>{

    const value=categoryFilter.value;

    const rows=document.querySelectorAll("#transactionList tr");

    rows.forEach((row,index)=>{

        if(value==="All"){

            row.style.display="";

        }

        else{

            row.style.display=
            transactions[index].category===value
            ? ""
            : "none";

        }

    });

});

// ======================================
// DARK MODE
// ======================================

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

});

// ======================================
// PIE & BAR CHARTS
// ======================================

function updateCharts(){

    const incomeTotal=transactions
    .filter(t=>t.type==="Income")
    .reduce((sum,t)=>sum+Number(t.amount),0);

    const expenseTotal=transactions
    .filter(t=>t.type==="Expense")
    .reduce((sum,t)=>sum+Number(t.amount),0);

    if(pieChart){

        pieChart.destroy();

    }

    if(barChart){

        barChart.destroy();

    }

    pieChart=new Chart(

        document.getElementById("pieChart"),

        {

            type:"pie",

            data:{

                labels:["Income","Expense"],

                datasets:[{

                    data:[incomeTotal,expenseTotal],

                    backgroundColor:[
                        "#22c55e",
                        "#ef4444"
                    ]

                }]

            }

        }

    );

    barChart=new Chart(

        document.getElementById("barChart"),

        {

            type:"bar",

            data:{

                labels:["Income","Expense"],

                datasets:[{

                    label:"Amount",

                    data:[
                        incomeTotal,
                        expenseTotal
                    ],

                    backgroundColor:[
                        "#22c55e",
                        "#ef4444"
                    ]

                }]

            },

            options:{

                responsive:true,

                scales:{

                    y:{

                        beginAtZero:true

                    }

                }

            }

        }

    );

}
// ======================================
// PDF EXPORT
// ======================================

document.getElementById("pdfBtn").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Personal Finance Tracker Report", 20, 20);

    let y = 40;

    transactions.forEach((item) => {

        doc.text(
            `${item.date} | ${item.title} | ${item.category} | ${item.type} | ₹${item.amount}`,
            20,
            y
        );

        y += 10;

        if (y > 270) {

            doc.addPage();

            y = 20;

        }

    });

    doc.save("Finance_Report.pdf");

});

// ======================================
// CSV EXPORT
// ======================================

document.getElementById("csvBtn").addEventListener("click", () => {

    let csv = "Title,Amount,Type,Category,Date\n";

    transactions.forEach(item => {

        csv += `${item.title},${item.amount},${item.type},${item.category},${item.date}\n`;

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "transactions.csv";

    link.click();

});

// ======================================
// INITIAL LOAD
// ======================================

loadTransactions();

updateCharts();



// Clear Data

const clearBtn = document.getElementById("clearData");

if (clearBtn) {

    clearBtn.addEventListener("click", () => {

        if(confirm("Delete all transactions?")){

            transactions=[];

            saveData();

            loadTransactions();

            updateCharts();

            showToast("All Transactions Deleted");

        }

    });

}