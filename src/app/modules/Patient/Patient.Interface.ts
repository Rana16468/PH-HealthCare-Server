import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";


interface PatientHealthData {
    dateOfBirth?: string;
    bloodGroup?: BloodGroup;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    height?: string;
    weight?: string;
    smokingStatus?: boolean;
    dietaryPreferences?: string;
    pregnancyStatus?: boolean;
    mentalHealthHistory?: string;
    immunizationStatus?: string;
    hasPastSurgeries?: boolean;
    recentAnxiety?: boolean;
    recentDepression?: boolean;
    maritalStatus?: MaritalStatus;
}

interface MedicalReport {
    reportName: string;
    reportLink: string;
}

export interface Patient {
    name?: string;
    contractNumber?: string;
    gender?: Gender;
    profilePhoto?: string;
    address?: string;
    patientHealthData?: PatientHealthData;
    medicalReport?: MedicalReport;
}

export type IPatientFilterRequest = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    contactNo?: string | undefined;
  };


