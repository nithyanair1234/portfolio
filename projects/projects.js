import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');

if (titleElement && projects) {
    titleElement.textContent = `${projects.length} Projects`;
}

let selectedYear = null; 
let query = ''; 
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

function filterProjects() {
    return projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        let matchesQuery = values.includes(query.toLowerCase());

        let matchesYear = selectedYear ? project.year === selectedYear : true;

        return matchesQuery && matchesYear;
    });
}

function renderPieChart() {
    let filteredForPie = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    let newRolledData = d3.rollups(
        filteredForPie,
        (v) => v.length,
        (d) => d.year,
    );

    let newData = newRolledData.map(([year, count]) => ({ value: count, label: year }));

    let svg = d3.select('svg');
    svg.selectAll('path').remove();
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    newArcData.forEach((d, i) => {
        svg.append('path')
           .attr('d', arcGenerator(d))
           .attr('fill', colors(i))
           .attr('class', newData[i].label === selectedYear ? 'selected' : '') 
           .on('click', () => {
               selectedYear = selectedYear === newData[i].label ? null : newData[i].label;
               
               renderProjects(filterProjects(), projectsContainer, 'h2');
               
               svg.selectAll('path').attr('class', (_, idx) => newData[idx].label === selectedYear ? 'selected' : '');
               legend.selectAll('li').attr('class', (_, idx) => newData[idx].label === selectedYear ? 'legend-item selected' : 'legend-item');
           });
    });

    newData.forEach((d, i) => {
        legend.append('li')
              .attr('style', `--color:${colors(i)}`)
              .attr('class', d.label === selectedYear ? 'legend-item selected' : 'legend-item')
              .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
              .on('click', () => {
                  selectedYear = selectedYear === d.label ? null : d.label;
                  renderProjects(filterProjects(), projectsContainer, 'h2');
                  svg.selectAll('path').attr('class', (_, idx) => newData[idx].label === selectedYear ? 'selected' : '');
                  legend.selectAll('li').attr('class', (_, idx) => newData[idx].label === selectedYear ? 'legend-item selected' : 'legend-item');
              });
    });

    renderProjects(filterProjects(), projectsContainer, 'h2');
}

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value; 
    renderPieChart(); 
});

renderPieChart();