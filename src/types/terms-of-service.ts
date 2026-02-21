export interface TermsOfServiceSection {
  id: string
  title: string
  content: string
}

export interface TermsVersion {
  version: string
  effectiveDate: string
  changelog?: string
}

export interface TermsOfServiceData {
  sections: TermsOfServiceSection[]
  version: TermsVersion
  versions: TermsVersion[]
}
