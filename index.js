import express from "express";

const app = express();
const port = process.env.PORT || 3317;

app.use(express.json({ limit: "10kb" }));

const apps = [
    { name: "Leave & Attendance", desc: "Apply for leave and check your balance.", cat: "people", icon: "🌴", href: "#" },
    { name: "Payslips", desc: "Download monthly payslips and tax forms.", cat: "finance", icon: "💵", href: "#" },
    { name: "Expense Claims", desc: "Submit bills and track reimbursements.", cat: "finance", icon: "🧾", href: "#" },
    { name: "Timesheets", desc: "Log your hours against projects.", cat: "work", icon: "⏱️", href: "#" },
    { name: "Project Board", desc: "Tasks, sprints and deadlines for your team.", cat: "work", icon: "📋", href: "#" },
    { name: "CRM", desc: "Customers, leads and sales pipeline.", cat: "work", icon: "🤝", href: "#" },
    { name: "Learning Hub", desc: "Courses, certifications and training.", cat: "people", icon: "🎓", href: "#" },
    { name: "Room Booking", desc: "Reserve meeting rooms and desks.", cat: "work", icon: "🏢", href: "#" },
];

const news = [
    { title: "Q3 results: record growth across all regions", meta: "Finance · 2 days ago" },
    { title: "New health insurance plan starts 1 December", meta: "HR · 4 days ago" },
    { title: "Scheduled maintenance this Saturday, 10 PM", meta: "IT · 5 days ago" },
    { title: "Diwali holiday schedule and office timings", meta: "HR · 1 week ago" },
];

const people = [
    { name: "Ananya Rao", role: "Product Manager", team: "Product", city: "Bengaluru" },
    { name: "Rohit Mehta", role: "Senior Engineer", team: "Engineering", city: "Pune" },
    { name: "Sara Thomas", role: "HR Business Partner", team: "People", city: "Bengaluru" },
    { name: "Vikram Nair", role: "Finance Lead", team: "Finance", city: "Mumbai" },
    { name: "Meera Iyer", role: "UX Designer", team: "Design", city: "Chennai" },
    // { name: "Arjun Singh", role: "Sales Manager", team: "Sales", city: "Delhi" },
];

const supportRequests = [];
const departments = new Set(["IT", "HR", "Facilities", "Finance"]);

app.get("/",(req, res)=>{
    res.json({
        "status": "ok"
    })
})

app.get("/api/apps", (req, res) => {
    const { category, search = "" } = req.query;
    const term = String(search).trim().toLowerCase();
    const result = apps.filter(item =>
        (!category || category === "all" || item.cat === category) &&
        `${item.name} ${item.desc}`.toLowerCase().includes(term)
    );
    res.json(result);
});

app.get("/api/news", (req, res) => {
    res.json(news);
});

app.get("/api/people", (req, res) => {
    const term = String(req.query.search ?? "").trim().toLowerCase();
    res.json(people.filter(person =>
        Object.values(person).join(" ").toLowerCase().includes(term)
    ));
});

app.post("/api/support", (req, res) => {
    const { name, email, dept, msg } = req.body ?? {};
    const errors = {};

    if (typeof name !== "string" || name.trim().length < 2) {
        errors.name = "Enter your name (at least 2 characters).";
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid work email.";
    }
    if (typeof dept !== "string" || !departments.has(dept)) {
        errors.dept = "Choose a valid team.";
    }
    if (typeof msg !== "string" || msg.trim().length < 10) {
        errors.msg = "Describe your request in at least 10 characters.";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    const request = {
        id: supportRequests.length + 1,
        name: name.trim(),
        email: email.trim(),
        dept,
        msg: msg.trim(),
        createdAt: new Date().toISOString(),
    };
    supportRequests.push(request);
    res.status(201).json({
        message: "Request received. The team will reply within one working day.",
        id: request.id,
    });
});

app.listen(port, ()=>{
    console.log("server started")
})