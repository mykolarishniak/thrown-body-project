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
    trajectoryPath.interrupt().attr("d", null);
    ball.interrupt().style("display", "none");

    const x0 = parseFloat(document.getElementById("x0").value) || 0;
    const y0 = parseFloat(document.getElementById("y0").value) || 0;
    const v0 = parseFloat(document.getElementById("v0").value);
    const alphaDeg = parseFloat(document.getElementById("alpha").value);
    const g = parseFloat(document.getElementById("g").value);
    const color = document.getElementById("graphColor").value;

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

    const a_q = 0.5 * g;
    const b_q = -v0 * Math.sin(alpha);
    const c_q = -y0;

    const D = b_q * b_q - 4 * a_q * c_q;
    if (D < 0) {
        alert("Помилка: Траєкторія не перетинає землю.");
        return;
    }

    const tFlight = (-b_q + Math.sqrt(D)) / (2 * a_q);

    if (tFlight <= 0) {
        alert("Помилка: Об’єкт миттєво впав або параметри некоректні.");
        return;
    }

    let hMax = y0;
    if (alphaDeg > 0) {
        hMax = y0 + Math.pow(v0 * Math.sin(alpha), 2) / (2 * g);
    }
    const lFlight = x0 + v0 * Math.cos(alpha) * tFlight;

    const xMin = Math.min(x0, lFlight, 0);
    const xMax = Math.max(x0, lFlight, 10);
    const yRangeMax = Math.max(y0, hMax, 10);

    xScale.domain([xMin - 5, xMax + 10]);
    yScale.domain([-5, yRangeMax + 10]);

    xAxisG.transition().duration(500).attr("transform", `translate(0, ${yScale(0)})`).call(d3.axisBottom(xScale));
    yAxisG.transition().duration(500).attr("transform", `translate(${xScale(0)}, 0)`).call(d3.axisLeft(yScale));

    const points = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
        let t = (tFlight / steps) * i;
        const x = x0 + v0 * Math.cos(alpha) * t;
        const y = y0 + v0 * Math.sin(alpha) * t - 0.5 * g * t * t;
        points.push({x: x, y: y});
    }

    const lineGen = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

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
