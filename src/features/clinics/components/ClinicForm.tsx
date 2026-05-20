"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { getSessionUserId } from "@/lib/auth/session";
import {
  useCreateClinicMutation,
  useUpdateClinicMutation,
} from "../store/clinicsApi";
import { resolveClinicFieldError } from "../lib/field-error";
import { formValuesToClinicPayload } from "../lib/map-payload";
import {
  clinicToFormSchedules,
  getDefaultFormSchedules,
} from "../lib/normalize";
import {
  clinicFormSchema,
  type ClinicFormValues,
} from "../schemas/clinicFormSchema";
import type { Clinic } from "../types/clinic";
import { SLOT_DURATION_OPTIONS } from "../lib/constants";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ClinicScheduleFields } from "./ClinicScheduleFields";

interface ClinicFormProps {
  mode: "create" | "edit";
  clinic?: Clinic;
  onSuccess?: () => void;
}

function buildDefaultValues(
  userId: string,
  clinic?: Clinic,
): ClinicFormValues {
  if (!clinic) {
    return {
      userId,
      name: "",
      address: "",
      phone: "",
      location: { lat: 30.0444, lng: 31.2357 },
      examinationFee: 0,
      slotDuration: 30,
      schedules: getDefaultFormSchedules(),
      isActive: true,
    };
  }

  return {
    userId: clinic.userId || userId,
    name: clinic.name,
    address: clinic.address,
    phone: clinic.phone,
    location: clinic.location,
    examinationFee: clinic.examinationFee,
    slotDuration: clinic.slotDuration,
    schedules: clinicToFormSchedules(clinic.schedules),
    isActive: clinic.isActive,
  };
}

function parseNumericInput(raw: string): number {
  if (raw === "") {
    return 0;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function ClinicForm({ mode, clinic, onSuccess }: ClinicFormProps) {
  const t = useTranslations("clinics");
  const reduxUserId = useAppSelector((state) => state.auth.user?.id);
  const userId = getSessionUserId(reduxUserId);
  const [createClinic, { isLoading: isCreating, isError: isCreateError }] =
    useCreateClinicMutation();
  const [updateClinic, { isLoading: isUpdating, isError: isUpdateError }] =
    useUpdateClinicMutation();

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: buildDefaultValues(userId, clinic),
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(buildDefaultValues(userId, clinic));
  }, [clinic, userId, form]);

  const isLoading = isCreating || isUpdating;
  const { errors, isSubmitted } = form.formState;

  const onInvalid = () => {
    toast.error(t("formValidationSummary"));
  };

  const onSubmit = async (values: ClinicFormValues) => {
    const payload = formValuesToClinicPayload({
      ...values,
      userId: values.userId || userId,
    });
    try {
      if (mode === "create") {
        await createClinic(payload).unwrap();
      } else if (clinic) {
        await updateClinic({ id: clinic.id, body: payload }).unwrap();
      }
      onSuccess?.();
    } catch {
      /* mutation error flags handle UI */
    }
  };

  const scheduleRootError =
    typeof errors.schedules?.message === "string"
      ? errors.schedules.message
      : undefined;
  const userIdError =
    typeof errors.userId?.message === "string" ? errors.userId.message : undefined;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-5"
        noValidate
      >
        <input type="hidden" {...form.register("userId")} />

        {isSubmitted && (userIdError || scheduleRootError) && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {userIdError && (
              <p>{resolveClinicFieldError(t, userIdError)}</p>
            )}
            {scheduleRootError && (
              <p>{resolveClinicFieldError(t, scheduleRootError)}</p>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-start">{t("name")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-11 cursor-text rounded-xl"
                  placeholder={t("namePlaceholder")}
                />
              </FormControl>
              <FormMessage>
                {resolveClinicFieldError(t, form.formState.errors.name?.message)}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-start">{t("address")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={2}
                  className="cursor-text rounded-xl"
                  placeholder={t("addressPlaceholder")}
                />
              </FormControl>
              <FormMessage>
                {resolveClinicFieldError(
                  t,
                  form.formState.errors.address?.message,
                )}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-start">{t("phone")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  className="h-11 cursor-text rounded-xl"
                  placeholder={t("phonePlaceholder")}
                />
              </FormControl>
              <FormMessage>
                {resolveClinicFieldError(t, form.formState.errors.phone?.message)}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="location.lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">{t("latitude")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    value={Number.isFinite(field.value) ? field.value : ""}
                    onChange={(e) => field.onChange(parseNumericInput(e.target.value))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="h-11 cursor-text rounded-xl"
                  />
                </FormControl>
                <FormMessage>
                  {resolveClinicFieldError(
                    t,
                    form.formState.errors.location?.lat?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location.lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">{t("longitude")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    value={Number.isFinite(field.value) ? field.value : ""}
                    onChange={(e) => field.onChange(parseNumericInput(e.target.value))}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="h-11 cursor-text rounded-xl"
                  />
                </FormControl>
                <FormMessage>
                  {resolveClinicFieldError(
                    t,
                    form.formState.errors.location?.lng?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="examinationFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">{t("examinationFee")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min={0}
                      value={Number.isFinite(field.value) ? field.value : ""}
                      onChange={(e) =>
                        field.onChange(parseNumericInput(e.target.value))
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="h-11 cursor-text rounded-xl pe-14"
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      {t("currency")}
                    </span>
                  </div>
                </FormControl>
                <FormMessage>
                  {resolveClinicFieldError(
                    t,
                    form.formState.errors.examinationFee?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slotDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">{t("slotDuration")}</FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full cursor-pointer rounded-xl">
                      <SelectValue placeholder={t("slotDuration")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SLOT_DURATION_OPTIONS.map((minutes) => (
                      <SelectItem
                        key={minutes}
                        value={String(minutes)}
                        className="cursor-pointer"
                      >
                        {t("minutes", { count: minutes })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {resolveClinicFieldError(
                    t,
                    form.formState.errors.slotDuration?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        <ClinicScheduleFields />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3">
              <div className="space-y-0.5 text-start">
                <FormLabel className="text-base">{t("isActive")}</FormLabel>
                <p className="text-xs text-muted-foreground">{t("isActiveHint")}</p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="cursor-pointer data-checked:bg-[var(--design-accent-teal)]"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {(isCreateError || isUpdateError) && (
          <p role="alert" className="text-sm text-destructive">
            {mode === "create" ? t("createError") : t("updateError")}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer rounded-xl bg-primary text-primary-foreground hover:bg-[var(--design-primary-active)]"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {mode === "create" ? t("createClinic") : t("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
