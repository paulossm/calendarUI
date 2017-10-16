# calendarUI
Implementation of a calendar UI which follows specific rules to arrange the events in a day.

<h2>The Problem</h2>

I was tasked to develop a calendar UI, but I should only show a single day.
The events are arranged in the day according to the following rules, from more important to less important:
<ul>
<li>Events must not overlap</li>
<li>The “earlier” the start time, the further left the event is positioned</li>
<li>The longer the duration of the event, the further left the event is positioned</li>
<li>The space must be used fully</li>
</ul>

According to above rules, the events data must have a criterious treatment in order to determine the correct placement of it.

<h2>Implementation</h2>
I built the application using <a href=https://angularjs.org">Angular JS</a> for better controlling the data between html and javaScript.
It was also specified some unit tests using <a href="https://jasmine.github.io">Jasmine</a> for testing the functionalities of the calendar.
