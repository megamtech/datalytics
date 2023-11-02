import { Injectable } from "@angular/core";
@Injectable()
export class ConstantService {
  public static PROJECT_NAME = "Datalytics";

  public static PROTOCOL = "http://";
  public static DOMAIN = "127.0.0.1";
  public static whiteListedURLS = [ConstantService.DOMAIN];
  public static TOKEN_NAME = "datalytics";

  public static BASE_URL =
    ConstantService.PROTOCOL + ConstantService.DOMAIN + "/datalyticsapi";
  // public static BASE_URL =
  //   ConstantService.PROTOCOL + ConstantService.DOMAIN + "/saffronapi";
  public static IMG_BASE_URL =
    ConstantService.PROTOCOL + ConstantService.DOMAIN + "/accounting_images/";

  public static API_URL = {
    user: {
      login: "auth/login",
      forgot_password: "user/forgot_password",
      change_password: "user/change_password",
      reset_password: "user/reset_password",
      suspenduser: "user/suspend_user",
      activate_user: "user/activate_user",
      create: "user/create",
      view: "user/view",
      edit: "user/edit",
      viewall: "user/viewall",
      delete: "user/delete",
    },
    country: {
      data: "country/viewall",
    }
    // *********************** Auto generated Routes added Before this ************************ //
  };

  // public static DateFormat = "dd/MM/yy, hh: mm";
  public static DateFormat = "dd/mm/yyyy";
  public static DateFormats = {
    parseInput: "l LT",
    fullPickerInput: "l LT",
    datePickerInput: "l",
    timePickerInput: "LT",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  };
  constructor() { }
}
