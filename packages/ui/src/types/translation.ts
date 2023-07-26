export interface ProjectTranslation {
  /**
   * Name of the file without extension
   */
  fileName: string

  /**
   * Name of the file with extension
   */
  fileFullName: string

  /**
   * Full file system path to the file
   */
  fullPath: string

  valid?: boolean
}

export interface LocaleContentDto {
  content: null | any
}