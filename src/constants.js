const Constants = (module.exports = {})

Constants.DATE_FORMAT_DMY = 'DD/MM/YYYY'
Constants.DATE_FORMAT_DMY_WITH_HMS = 'DD/MM/YYYY HH:mm:ss'
Constants.DATE_FORMAT_FULL = 'Do MMMM YYYY'
Constants.BOOLEAN_TRUE = 'true'

Constants.Registers = {
  WASTE_OPERATIONS: 'Waste Operations',
  END_OF_LIFE_VEHICLES_DISPLAY_VALUE: 'End of Life Vehicles (ATF Register)',
  END_OF_LIFE_VEHICLES: 'End of Life Vehicles',
  INSTALLATIONS: 'Installations',
  RADIOACTIVE_SUBSTANCES: 'Radioactive Substances',
  DISCHARGES_TO_WATER_AND_GROUNDWATER: 'Water Quality Discharge Consents',
  DISCHARGES_TO_WATER_AND_GROUNDWATER_DISPLAY_VALUE: 'Discharges to water and groundwater'
}

Constants.Views = {
  CONTACT: {
    route: 'contact',
    pageHeading: 'Request further information about this permit',
    pageHeadingSearchMode: 'Request further information'
  },
  CONTACT_COMPLETE: {
    route: 'contact-complete',
    pageHeading: 'Contact complete'
  },
  DOWNLOAD: {
    route: 'download',
    pageHeading: 'Unable to download document'
  },
  ENTER_PERMIT_NUMBER: {
    route: 'enter-permit-number',
    pageHeading: 'Do you know the permit number of the record you are looking for?'
  },
  HOME: {
    route: 'home',
    pageHeading: 'Search for documents on the public register'
  },
  PERMIT_NOT_FOUND: {
    route: 'permit-not-found',
    pageHeading: 'Unable to find permit'
  },
  SELECT_REGISTER: {
    route: 'select-register',
    pageHeading: 'What activity would you like to search for documents?'
  },
  SERVICE_STATUS: {
    route: 'service-status',
    pageHeading: 'Service status'
  },
  SOMETHING_WENT_WRONG: {
    route: 'something-went-wrong',
    pageHeading: 'Oops, something went wrong'
  },
  VIEW_PERMIT_DOCUMENTS: {
    route: 'view-permit-documents',
    pageHeading: 'Permit details'
  }
}
