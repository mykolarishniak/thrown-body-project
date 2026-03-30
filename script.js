// const container = document.getElementById("chart-container");
// const margin = {top: 50, right: 50, bottom: 50, left: 60};

// let width = container.clientWidth - margin.left - margin.right;
// let height = container.clientHeight - margin.top - margin.bottom;

// const svg = d3.select("#chart")
//     .append("svg")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
//     .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// let xScale = d3.scaleLinear().range([0, width]);
// let yScale = d3.scaleLinear().range([height, 0]);

// let xAxisG = svg.append("g").attr("class", "x-axis");
// let yAxisG = svg.append("g").attr("class", "y-axis");

// let trajectoryPath = svg.append("path").attr("fill", "none").attr("stroke-width", 3);
// let ball = svg.append("circle").attr("r", 6).attr("fill", "red").style("display", "none");

// function initChart() {
//     xScale.domain([-10, 100]);
//     yScale.domain([-10, 60]);
//     xAxisG.attr("transform", `translate(0, ${yScale(0)})`).call(d3.axisBottom(xScale));
//     yAxisG.attr("transform", `translate(${xScale(0)}, 0)`).call(d3.axisLeft(yScale));
// }



// function startSimulation() {
//     trajectoryPath.interrupt().attr("d", null);
//     ball.interrupt().style("display", "none");

//     const v0 = parseFloat(document.getElementById("v0").value);
//     const alphaDeg = parseFloat(document.getElementById("alpha").value);
//     const g = parseFloat(document.getElementById("g").value);
//     const color = document.getElementById("graphColor").value;

//     const alpha = alphaDeg * Math.PI / 180;

//     const tFlightReal = (2 * v0 * Math.sin(alpha)) / g;
//     const tFlight = Math.abs(tFlightReal);

//     const hMax = (Math.pow(v0 * Math.sin(alpha), 2)) / (2 * g);
//     const lFlight = (Math.pow(v0, 2) * Math.sin(2 * alpha)) / g;

//     const xLimit = Math.abs(lFlight) > 0 ? Math.abs(lFlight) : 100;

//     xScale.domain([-xLimit * 1.2, xLimit * 1.2]);
//     yScale.domain([-hMax * 0.2, hMax * 1.2]);

//     xAxisG.transition().duration(500).attr("transform", `translate(0, ${yScale(0)})`).call(d3.axisBottom(xScale));
//     yAxisG.transition().duration(500).attr("transform", `translate(${xScale(0)}, 0)`).call(d3.axisLeft(yScale));

//     const points = [];
//     const steps = 100;
//     for (let i = 0; i <= steps; i++) {
//         let t = (tFlightReal / steps) * i;
//         const x = v0 * Math.cos(alpha) * t;
//         const y = v0 * Math.sin(alpha) * t - 0.5 * g * t * t;
//         points.push({x: x, y: y});
//     }

//     const lineGen = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

//     trajectoryPath
//         .datum(points)
//         .attr("d", lineGen)
//         .attr("stroke", color)
//         .attr("stroke-dasharray", function() { return this.getTotalLength(); })
//         .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
//         .transition()
//         .duration(2000)
//         .ease(d3.easeLinear)
//         .attr("stroke-dashoffset", 0);

//     ball.style("display", "block").attr("cx", xScale(0)).attr("cy", yScale(0));

//     let startTime = null;
//     function animate(timestamp) {
//         if (!startTime) startTime = timestamp;
//         let progress = Math.min((timestamp - startTime) / 2000, 1);

//         let t = progress * tFlightReal;
//         let curX = v0 * Math.cos(alpha) * t;
//         let curY = v0 * Math.sin(alpha) * t - 0.5 * g * t * t;

//         ball.attr("cx", xScale(curX)).attr("cy", yScale(curY));
//         if (progress < 1) requestAnimationFrame(animate);
//     }
//     requestAnimationFrame(animate);

//     document.getElementById("results").innerHTML = `
//         <p>Час польоту: ${Math.abs(tFlightReal).toFixed(2)} с</p>
//         <p>Дальність: ${Math.abs(lFlight).toFixed(2)} м</p>
//         <p>Висота: ${hMax.toFixed(2)} м</p>
//     `;
// }


// document.getElementById("startBtn").addEventListener("click", startSimulation);
// document.getElementById("clearBtn").addEventListener("click", () => {
//     trajectoryPath.interrupt().attr("d", null);
//     ball.interrupt().style("display", "none");
//     document.getElementById("results").innerHTML = "";
//     initChart();
// });

// initChart();

const container = document.getElementById("chart-container");
const margin = {top: 50, right: 50, bottom: 50, left: 60};

let width = container.clientWidth - margin.left - margin.right;
let height = container.clientHeight - margin.top - margin.bottom;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

let xScale = d3.scaleLinear().range([0, width]);
let yScale = d3.scaleLinear().range([height, 0]);

let xAxisG = svg.append("g").attr("class", "x-axis");
let yAxisG = svg.append("g").attr("class", "y-axis");

let trajectoryPath = svg.append("path").attr("fill", "none").attr("stroke-width", 3);
let ball = svg.append("circle").attr("r", 6).attr("fill", "red").style("display", "none");

// Ініціалізація порожнього графіка (Sprint 2)
function initChart() {
    xScale.domain([-10, 100]);
    yScale.domain([-10, 60]);
    updateAxes(0, 0);
}

function updateAxes(originX, originY) {
    xAxisG.transition().duration(500).attr("transform", `translate(0, ${yScale(0)})`).call(d3.axisBottom(xScale));
    yAxisG.transition().duration(500).attr("transform", `translate(${xScale(0)}, 0)`).call(d3.axisLeft(yScale));
}

function startSimulation() {
    // 1. ПІДГОТОВКА СЦЕНИ (Скидання попередніх анімацій)
    trajectoryPath.interrupt().attr("d", null);
    ball.interrupt().style("display", "none");

    // 2. ЗБІР ДАНИХ (Sprint 1)
    const x0 = parseFloat(document.getElementById("x0").value) || 0;
    const y0 = parseFloat(document.getElementById("y0").value) || 0;
    const v0 = parseFloat(document.getElementById("v0").value);
    const alphaDeg = parseFloat(document.getElementById("alpha").value);
    const g = parseFloat(document.getElementById("g").value);
    const color = document.getElementById("graphColor").value;

    // 3. ВАЛІДАЦІЯ (Технічна перевірка фізичної моделі)
    if (isNaN(v0) || v0 < 0) {
        alert("Помилка: Швидкість v0 має бути додатним числом.");
        return;
    }
    if (isNaN(g) || g <= 0) {
        alert("Помилка: Прискорення g має бути більшим за 0.");
        return;
    }
    if (y0 < 0) {
        alert("Помилка: Початкова висота y0 не може бути від'ємною в цій моделі.");
        return;
    }
    if (alphaDeg > 90 || alphaDeg < -90) {
        alert("Помилка: Кут має бути в межах від -90 до 90 градусів.");
        return;
    }

    const alpha = alphaDeg * Math.PI / 180;

    // 4. МАТЕМАТИЧНИЙ РОЗРАХУНОК (Квадратне рівняння для часу польоту)
    // Формула: y0 + v0*sin(a)*t - 0.5*g*t^2 = 0
    // Перетворюємо на: (0.5*g)t^2 - (v0*sin(a))t - y0 = 0
    const a_q = 0.5 * g;
    const b_q = -v0 * Math.sin(alpha);
    const c_q = -y0;

    const D = b_q * b_q - 4 * a_q * c_q;
    if (D < 0) {
        alert("Помилка: Траєкторія не перетинає землю.");
        return;
    }

    // Беремо лише додатний корінь часу
    const tFlight = (-b_q + Math.sqrt(D)) / (2 * a_q);

    if (tFlight <= 0) {
        alert("Помилка: Об’єкт миттєво впав або параметри некоректні.");
        return;
    }

    // Максимальна висота (H) та дальність (L)
    let hMax = y0;
    if (alphaDeg > 0) {
        hMax = y0 + Math.pow(v0 * Math.sin(alpha), 2) / (2 * g);
    }
    const lFlight = x0 + v0 * Math.cos(alpha) * tFlight;

    // 5. МАСШТАБУВАННЯ ОСЕЙ (Sprint 2)
    const xMin = Math.min(x0, lFlight, 0);
    const xMax = Math.max(x0, lFlight, 10);
    const yRangeMax = Math.max(y0, hMax, 10);

    xScale.domain([xMin - 5, xMax + 10]);
    yScale.domain([-5, yRangeMax + 10]);

    // Плавно оновлюємо осі під новий масштаб
    xAxisG.transition().duration(500).attr("transform", `translate(0, ${yScale(0)})`).call(d3.axisBottom(xScale));
    yAxisG.transition().duration(500).attr("transform", `translate(${xScale(0)}, 0)`).call(d3.axisLeft(yScale));

    // 6. ГЕНЕРАЦІЯ ТОЧОК ТРАЄКТОРІЇ (Sprint 3)
    const points = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
        let t = (tFlight / steps) * i;
        const x = x0 + v0 * Math.cos(alpha) * t;
        const y = y0 + v0 * Math.sin(alpha) * t - 0.5 * g * t * t;
        points.push({x: x, y: y});
    }

    const lineGen = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

    // Відмальовування лінії з ефектом "малювання"
    trajectoryPath
        .datum(points)
        .attr("d", lineGen)
        .attr("stroke", color)
        .attr("stroke-dasharray", function() { return this.getTotalLength(); })
        .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    // 7. АНІМАЦІЯ КУЛЬКИ (Sprint 4)
    ball.style("display", "block").attr("cx", xScale(x0)).attr("cy", yScale(y0));

    let startTime = null;
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = Math.min((timestamp - startTime) / 2000, 1);

        let t = progress * tFlight;
        let curX = x0 + v0 * Math.cos(alpha) * t;
        let curY = y0 + v0 * Math.sin(alpha) * t - 0.5 * g * t * t;

        ball.attr("cx", xScale(curX)).attr("cy", yScale(curY));

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);

    // 8. ВИВІД ТЕКСТОВИХ РЕЗУЛЬТАТІВ
    document.getElementById("results").innerHTML = `
        <div style="border-left: 4px solid ${color}; padding-left: 10px;">
            <p><b>Час польоту:</b> ${tFlight.toFixed(2)} с</p>
            <p><b>Дальність:</b> ${lFlight.toFixed(2)} м</p>
            <p><b>Макс. висота:</b> ${hMax.toFixed(2)} м</p>
        </div>
    `;
}

document.getElementById("startBtn").addEventListener("click", startSimulation);
document.getElementById("clearBtn").addEventListener("click", () => {
    trajectoryPath.interrupt().attr("d", null);
    ball.interrupt().style("display", "none");
    document.getElementById("results").innerHTML = "";
    initChart();
});

initChart();
