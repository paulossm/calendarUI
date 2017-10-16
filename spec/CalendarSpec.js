"use strict";

describe('calendarOrganizerTest', function() {

    var eventService,
        calendarOrganizerService,
        events;

    beforeEach(module('calendarUI'));

    describe("when no events collide", function() {
        beforeEach(inject(function (_eventService_, _calendarOrganizerService_) {
            eventService = _eventService_;
            calendarOrganizerService = _calendarOrganizerService_;
        }));

        var events;

        beforeEach(function() {
            events = [];
        });
        
        it("should show events in a single column", function() {
            events.push(eventService.createEvent("red", new Date("2017-10-13T00:00:00"), new Date("2017-10-13T08:00:00")));
            events.push(eventService.createEvent("green", new Date("2017-10-13T08:00:00"), new Date("2017-10-13T16:00:00")));
            events.push(eventService.createEvent("blue", new Date("2017-10-13T16:00:00"), new Date("2017-10-13T23:30:00")));
            calendarOrganizerService.organize(events);
            for(var index in events) {
                expect(events[index].column).toEqual(1);
            }
        });

        it("should not collide successive events", function() {
            for(var index = 0, events = []; index < 24; index++) {
                events.push(eventService.createEvent("brown", new Date("2017-10-13T" + ("0" + index).slice(-2) + ":00:00"), new Date("2017-10-13T" + ("0" + (index+1)).slice(-2) + ":00:00")))
            }
            calendarOrganizerService.organize(events);

            for(index in events) {
                expect(events[index].column).toEqual(1);
            }
        })
    });

    describe("when two events collide", function() {
        beforeEach(inject(function (_eventService_, _calendarOrganizerService_) {
            eventService = _eventService_;
            calendarOrganizerService = _calendarOrganizerService_;
        }));
        
        var events;

        beforeEach(function() {
            events = [];
        });
        
        it("should place the earlier to the left", function() {
            events.push(eventService.createEvent("blue", new Date("2017-10-13T10:00:00"), new Date("2017-10-13T12:00:00")));
            events.push(eventService.createEvent("green", new Date("2017-10-13T09:00:00"), new Date("2017-10-13T13:00:00")));
            calendarOrganizerService.organize(events);
            
            expect(events[0].color).toEqual("green");
            expect(events[0].column).toEqual(1);
            expect(events[1].color).toEqual("blue");
            expect(events[1].column).toEqual(2);
        });

        it("should place the longer event to the left", function() {
            events.push(eventService.createEvent("orange", new Date("2017-10-13T12:00:00"), new Date("2017-10-13T15:00:00")));
            events.push(eventService.createEvent("red", new Date("2017-10-13T12:00:00"), new Date("2017-10-13T17:00:00")));
            calendarOrganizerService.organize(events);
            
            // once calendar organize rearranje the events according to the rules, the 'red' should be at the first position
            expect(events[0].color).toEqual("red");
            expect(events[0].column).toEqual(1);
            expect(events[1].color).toEqual("orange");
            expect(events[1].column).toEqual(2);
        })
    });

    describe("events always", function() {
        beforeEach(inject(function (_eventService_, _calendarOrganizerService_) {
            eventService = _eventService_;
            calendarOrganizerService = _calendarOrganizerService_;
        }));
        
        var events;

        beforeEach(function() {
            events = [];
        });


        it("should use the complete available space", function() {
            events.push(eventService.createEvent("blue", new Date("2017-10-13T09:00:00"), new Date("2017-10-13T15:30:00")));
            events.push(eventService.createEvent("green", new Date("2017-10-13T09:00:00"), new Date("2017-10-13T14:30:00")));
            events.push(eventService.createEvent("brown", new Date("2017-10-13T09:30:00"), new Date("2017-10-13T11:30:00")));
            events.push(eventService.createEvent("red", new Date("2017-10-13T11:30:00"), new Date("2017-10-13T12:30:00")));
            events.push(eventService.createEvent("orange", new Date("2017-10-13T14:30:00"), new Date("2017-10-13T15:00:00")));
            events.push(eventService.createEvent("yellow", new Date("2017-10-13T15:30:00"), new Date("2017-10-13T16:00:00")));
            calendarOrganizerService.organize(events);

            expect(events[4].color).toEqual("orange");
            expect(events[4].spanWidth).toBe(true);
            expect(events[5].color).toEqual("yellow");
            expect(events[5].spanWidth).toBe(true);
        });
    });
});

