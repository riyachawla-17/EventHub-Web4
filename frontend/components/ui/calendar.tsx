"use client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export const Calendar = (props: any) => (
  <div className="p-2 border rounded">
    <DayPicker {...props} />
  </div>
);
