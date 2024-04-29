const templateEjs = `
<%
    const DEFAULT_IMAGE_WIDTH = 960;
    const LEFT_MARGIN = 20;
    const RIGHT_MARGIN = 200;
    const MIN_PX_PER_MS = 200 / 1000;

    const LINE_HEIGHT = 50;
    const BAR_HEIGHT = 20;

    const _durations = durations.map((d) => ({ ...d, endTime: d.startTime + d.duration }));

    const maxEndTime = Math.max(..._durations.map((log) => log.endTime));
    const stageWidth = Math.max(maxEndTime * MIN_PX_PER_MS, DEFAULT_IMAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN);
    const imageWidth = stageWidth + LEFT_MARGIN + RIGHT_MARGIN;

    const scaleX = (time, noShift = false) => time * (stageWidth / maxEndTime) + (noShift ? 0 : LEFT_MARGIN);
    const shiftY = (lineIndex) => (lineIndex + 1) * LINE_HEIGHT;

    const bottomEdge = shiftY(_durations.length);

    const toSec = (ms) => ms === 0 ? '' : (ms / 1000).toFixed(2);
-%>
<svg width="<%- imageWidth %>" height="<%- bottomEdge %>" viewBox="0 0 <%- imageWidth %> <%- bottomEdge %>" xmlns="http://www.w3.org/2000/svg">
    <style>
      line {
        stroke: #eee;
      }
      text {
        font-size: 13px;
        font-family: monospace;
        fill: #444;
      }
      text.scale {
        text-anchor: middle;
        fill: #999;
      }
      text.startTime,
      text.endTime,
      text.duration {
        dominant-baseline: middle;
        font-size: 11px;
        fill: #999;
      }
      text.startTime {
        text-anchor: end;
      }
      text.endTime.last {
        font-weight: bold;
        fill: #444;
      }
      text.duration {
        text-anchor: end;
        fill: #fff;
      }
      rect.bar {
        fill: #36c;
      }
    </style>
<% for (let x = 0; x < maxEndTime; x += 200) { %>
    <text class="scale" x="<%- scaleX(x) %>" y="20"><%- toSec(x) %></text>
    <line class="scale" x1="<%- scaleX(x) %>" y1="24" x2="<%- scaleX(x) %>" y2="<%- bottomEdge %>" />
<% } %>
<% _durations.forEach((d, index) => { %>
    <text class="title" x="<%- scaleX(d.startTime) %>" y="<%- shiftY(index) %>"><%- d.title %></text>
    <rect class="bar" x="<%- scaleX(d.startTime) %>" y="<%- shiftY(index) + 5 %>" width="<%- scaleX(d.duration, true) %>" height="<%- BAR_HEIGHT %>" rx="4" />
    <text class="startTime" x="<%- scaleX(d.startTime) - 5 %>" y="<%- shiftY(index) + 6 + (BAR_HEIGHT / 2) %>"><%- toSec(d.startTime) %></text>
    <text class="endTime<%- d.endTime === maxEndTime ? ' last': '' %>" x="<%- scaleX(d.startTime + d.duration) + 5 %>" y="<%- shiftY(index) + 6 + (BAR_HEIGHT / 2) %>"><%- toSec(d.endTime) %></text>
    <text class="duration" x="<%- scaleX(d.startTime + d.duration) - 2 %>" y="<%- shiftY(index) + 6 + (BAR_HEIGHT / 2) %>"><%- toSec(d.duration) %></text>
<% }) -%>
</svg>
`;
export default templateEjs.trim();
