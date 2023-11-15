import authorizedAxios from "src/utils/axios/authorizedAxios";
import { BE_API } from "src/utils/api";
import { LanguagesResponse } from "@/@types/language";

export const getLanguages = () => authorizedAxios.get<LanguagesResponse>(BE_API.languages);
