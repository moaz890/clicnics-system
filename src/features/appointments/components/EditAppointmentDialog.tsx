"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarDays, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useGetAppointmentByIdQuery,
  useUpdateAppointmentMutation,
} from "../appointmentsApi";
import { resolveAppointmentFieldError } from "../lib/field-error";
import { formatAppointmentTimeRange } from "../lib/normalize";
import {
  appointmentFormSchema,
  type AppointmentFormValues,
} from "../schemas/appointmentFormSchema";
import type { Appointment } from "../types/appointment";
import { getToday, isDateBeforeToday, stringifyApiDate } from "@/features/clinics/lib/date";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface EditAppointmentDialogProps {
  appointmentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function parseApiDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return getToday();
  return new Date(y, m - 1, d);
}

function buildDefaults(appointment: Appointment): AppointmentFormValues {
  return {
    appointmentDate: appointment.appointmentDate,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    notes: appointment.notes ?? "",
    status: appointment.status,
  };
}

export function EditAppointmentDialog({
  appointmentId,
  open,
  onOpenChange,
}: EditAppointmentDialogProps) {
  const t = useTranslations("appointments");
  const locale = useLocale();
  const dateFnsLocale = locale === "ar" ? ar : enUS;
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { data: appointment } = useGetAppointmentByIdQuery(appointmentId ?? "", {
    skip: !appointmentId || !open,
  });
  const [updateAppointment, { isLoading, isError }] =
    useUpdateAppointmentMutation();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      appointmentDate: "",
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (appointment) {
      form.reset(buildDefaults(appointment));
    }
  }, [appointment, form]);

  const selectedDate = form.watch("appointmentDate")
    ? parseApiDate(form.watch("appointmentDate"))
    : getToday();

  const onSubmit = async (values: AppointmentFormValues) => {
    if (!appointmentId) return;
    try {
      await updateAppointment({
        id: appointmentId,
        body: {
          appointmentDate: values.appointmentDate,
          startTime: values.startTime,
          endTime: values.endTime,
          notes: values.notes?.trim() || undefined,
        },
      }).unwrap();
      toast.success(t("updateSuccess"));
      onOpenChange(false);
    } catch {
      /* isError */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-6 py-5 text-start">
          <DialogTitle className="text-popover-foreground">
            {t("editTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {appointment
              ? `${appointment.patientName ?? appointment.patientId} · ${formatAppointmentTimeRange(appointment)}`
              : t("editDescription")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-7rem)]">
          <div className="px-6 py-5">
            {appointment ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="appointmentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-start">{t("date")}</FormLabel>
                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                          <PopoverTrigger
                            className={cn(
                              "inline-flex h-11 w-full cursor-pointer items-center justify-start gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                            )}
                          >
                            <CalendarDays
                              className="size-4 shrink-0 text-primary"
                              aria-hidden
                            />
                            <span className="text-start">
                              {field.value
                                ? format(parseApiDate(field.value), "PPP", {
                                    locale: dateFnsLocale,
                                  })
                                : t("selectDate")}
                            </span>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                if (!date || isDateBeforeToday(date)) return;
                                field.onChange(stringifyApiDate(date));
                                setCalendarOpen(false);
                              }}
                              disabled={(date) => isDateBeforeToday(date)}
                              defaultMonth={selectedDate}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage>
                          {resolveAppointmentFieldError(
                            t,
                            form.formState.errors.appointmentDate?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-start">
                            {t("startTime")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
                              dir="ltr"
                              className="h-11 cursor-text rounded-xl text-start"
                            />
                          </FormControl>
                          <FormMessage>
                            {resolveAppointmentFieldError(
                              t,
                              form.formState.errors.startTime?.message,
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-start">
                            {t("endTime")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
                              dir="ltr"
                              className="h-11 cursor-text rounded-xl text-start"
                            />
                          </FormControl>
                          <FormMessage>
                            {resolveAppointmentFieldError(
                              t,
                              form.formState.errors.endTime?.message,
                            )}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-start">{t("notes")}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-20 cursor-text resize-y rounded-xl"
                            placeholder={t("notesPlaceholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isError ? (
                    <p role="alert" className="text-sm text-destructive">
                      {t("updateError")}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer rounded-xl bg-primary text-primary-foreground hover:bg-[var(--design-primary-active)]"
                  >
                    {isLoading && (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    )}
                    {t("saveChanges")}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="flex justify-center py-8">
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
