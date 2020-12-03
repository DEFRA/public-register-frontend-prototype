const Constants = module.exports = {}

Constants.DATE_FORMAT_DMY = 'DD/MM/YYYY'
Constants.DATE_FORMAT_DMY_WITH_HMS = 'DD/MM/YYYY HH:mm:ss'

Constants.Views = {
  DOWNLOAD: {
    route: 'download'
  },
  ENTER_PERMIT_NUMBER: {
    route: 'enter-permit-number',
    pageHeading: 'Do you know the permit number of the record you are looking for?'
  },
  HOME: {
    route: 'home',
    pageHeading: 'Search for documents on the public register'
  },
  SERVICE_STATUS: {
    route: 'service-status',
    pageHeading: 'Service status'
  },
  VIEW_PERMIT_DETAILS: {
    route: 'view-permit-details',
    pageHeading: 'Permit details'
  }
}
