
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Video, Edit3, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  dateTime: Date;
  type: 'Video Call' | 'In-Person';
  duration: string; 
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date | undefined>(undefined);
  const [todayDate, setTodayDate] = useState<Date | undefined>(undefined);
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const now = new Date();
    const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Keep only date part for today

    setTodayDate(localNow);
    setSelectedDate(localNow); 
    setCurrentCalendarMonth(localNow);

    const getFutureDate = (baseDate: Date, days: number, hours: number, minutes: number): Date => {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + days);
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    setAppointmentList([
        {
            id: "1",
            doctorName: "Dr. Evelyn Reed",
            specialty: "Cardiology",
            dateTime: getFutureDate(localNow, 3, 10, 0),
            type: "Video Call",
            duration: "30 minutes",
        },
        {
            id: "2",
            doctorName: "Dr. Ben Carter",
            specialty: "Pediatrics",
            dateTime: getFutureDate(localNow, 5, 14, 30),
            type: "Video Call",
            duration: "45 minutes",
        },
        {
            id: "3",
            doctorName: "Dr. Anya Sharma",
            specialty: "Dermatology",
            dateTime: getFutureDate(localNow, 10, 9, 0),
            type: "In-Person",
            duration: "1 hour",
        },
        {
            id: "4",
            doctorName: "Dr. Olivia Chen",
            specialty: "General Practice",
            dateTime: getFutureDate(localNow, 0, 16, 0), // Today at 4:00 PM if current time is before 4 PM
            type: "Video Call",
            duration: "30 minutes",
        },
         {
            id: "5",
            doctorName: "Dr. Ken Miles",
            specialty: "Orthopedics",
            dateTime: getFutureDate(localNow, 3, 11, 0), // Same day as Dr. Reed, different time
            type: "In-Person",
            duration: "40 minutes",
        }
    ].filter(app => app.dateTime >= now)); // Filter out appointments that are already past today's current time

  }, []);

  const upcomingAppointments = appointmentList
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

  const appointmentsForSelectedDate = selectedDate
    ? upcomingAppointments.filter(
        (app) => format(app.dateTime, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  const handlePlaceholderAction = (actionName: string) => {
    toast({
      title: "Feature Placeholder",
      description: `${actionName} functionality is not yet implemented.`,
    });
  };
  
  if (!todayDate || !selectedDate || !currentCalendarMonth) {
    return (
        <div className="space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                <p className="text-muted-foreground">Manage your upcoming appointments and book new ones.</p>
                </div>
                 <Button size="lg" disabled>
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Book New Appointment
                </Button>
            </div>
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-muted-foreground text-lg">Loading schedule...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">Manage your upcoming appointments and book new ones.</p>
        </div>
        <Button size="lg" onClick={() => handlePlaceholderAction('Book New Appointment')}>
          <CalendarIcon className="mr-2 h-5 w-5" />
          Book New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>Select a Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-0 pt-2 sm:p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentCalendarMonth}
              onMonthChange={setCurrentCalendarMonth}
              className="rounded-md border"
              disabled={(date) => date < new Date(new Date(todayDate).setDate(todayDate.getDate()))}
              initialFocus
              modifiers={{
                hasAppointment: upcomingAppointments.map(app => app.dateTime).filter(d => format(d, "yyyy-MM-dd") !== format(selectedDate, "yyyy-MM-dd"))
              }}
              modifiersClassNames={{
                hasAppointment: 'bg-primary/10 text-primary rounded-md font-semibold'
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Appointments for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Upcoming Appointments"}
            </CardTitle>
            <CardDescription>
              {selectedDate
                ? appointmentsForSelectedDate.length > 0 ? "Here are your scheduled appointments for the selected day." : "No appointments for this day."
                : upcomingAppointments.length > 0 ? "Review your next few appointments." : "No upcoming appointments."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {(selectedDate ? appointmentsForSelectedDate : upcomingAppointments.slice(0,5)).length > 0 ? (
              (selectedDate ? appointmentsForSelectedDate : upcomingAppointments.slice(0, selectedDate ? undefined : 5)).map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card relative group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{appointment.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    </div>
                    <Badge variant={appointment.type === 'Video Call' ? "default" : "secondary"} className="mt-2 sm:mt-0 capitalize">
                      {appointment.type === 'Video Call' && <Video className="mr-1.5 h-3.5 w-3.5" />}
                      {appointment.type.toLowerCase()}
                    </Badge>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{format(appointment.dateTime, "EEE, MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{format(appointment.dateTime, "p")} ({appointment.duration})</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-3 right-3">
                    <Button variant="outline" size="sm" onClick={() => handlePlaceholderAction(`Reschedule ${appointment.doctorName}'s appointment`)}>
                        <Edit3 className="mr-1.5 h-3.5 w-3.5"/> Reschedule
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handlePlaceholderAction(`Cancel ${appointment.doctorName}'s appointment`)}>
                        <XCircle className="mr-1.5 h-3.5 w-3.5"/> Cancel
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <CalendarIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No appointments scheduled {selectedDate && format(selectedDate, "yyyy-MM-dd") === format(todayDate, "yyyy-MM-dd") ? "for today" : selectedDate ? "for this day" : "at this time"}.</p>
              </div>
            )}
          </CardContent>
           {!selectedDate && upcomingAppointments.length > 5 && (
            <CardFooter>
                <Button variant="link" className="mx-auto" onClick={() => handlePlaceholderAction('View All Upcoming Appointments')}>View All Upcoming Appointments</Button>
            </CardFooter>
           )}
        </Card>
      </div>
    </div>
  );
}

