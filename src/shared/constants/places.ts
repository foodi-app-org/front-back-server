interface Department {
    c_digo_dane_del_departamento: string
    departamento: string
    region: string
}

interface Place {
    c_digo_dane_del_departamento: string
    departamento: string
    c_digo_dane_del_municipio: string
    municipio: string
    cName: string
    ctId: string
    region: string
}

export const DEPARTMENTS: Department[] = [
  { c_digo_dane_del_departamento: '05', departamento: 'Antioquia', region: 'Unknown' },
  { c_digo_dane_del_departamento: '08', departamento: 'Atlantico', region: 'Unknown' },
  { c_digo_dane_del_departamento: '11', departamento: 'Bogota D.C.', region: 'Unknown' },
  { c_digo_dane_del_departamento: '13', departamento: 'Bolivar', region: 'Unknown' },
  { c_digo_dane_del_departamento: '15', departamento: 'Boyaca', region: 'Unknown' },
  { c_digo_dane_del_departamento: '17', departamento: 'Caldas', region: 'Unknown' },
  { c_digo_dane_del_departamento: '18', departamento: 'Caqueta', region: 'Unknown' },
  { c_digo_dane_del_departamento: '19', departamento: 'Cauca', region: 'Unknown' },
  { c_digo_dane_del_departamento: '20', departamento: 'Cesar', region: 'Unknown' },
  { c_digo_dane_del_departamento: '23', departamento: 'Cordoba', region: 'Unknown' },
  { c_digo_dane_del_departamento: '25', departamento: 'Cundinamarca', region: 'Unknown' },
  { c_digo_dane_del_departamento: '27', departamento: 'Choco', region: 'Unknown' },
  { c_digo_dane_del_departamento: '41', departamento: 'Huila', region: 'Unknown' },
  { c_digo_dane_del_departamento: '44', departamento: 'La Guajira', region: 'Unknown' },
  { c_digo_dane_del_departamento: '47', departamento: 'Magdalena', region: 'Unknown' },
  { c_digo_dane_del_departamento: '50', departamento: 'Meta', region: 'Unknown' },
  { c_digo_dane_del_departamento: '52', departamento: 'Nariño', region: 'Unknown' },
  { c_digo_dane_del_departamento: '54', departamento: 'Norte De Santander', region: 'Unknown' },
  { c_digo_dane_del_departamento: '63', departamento: 'Quindio', region: 'Unknown' },
  { c_digo_dane_del_departamento: '66', departamento: 'Risaralda', region: 'Unknown' },
  { c_digo_dane_del_departamento: '68', departamento: 'Santander', region: 'Unknown' },
  { c_digo_dane_del_departamento: '70', departamento: 'Sucre', region: 'Unknown' },
  { c_digo_dane_del_departamento: '73', departamento: 'Tolima', region: 'Unknown' },
  { c_digo_dane_del_departamento: '76', departamento: 'Valle Del Cauca', region: 'Unknown' },
  { c_digo_dane_del_departamento: '81', departamento: 'Arauca', region: 'Unknown' },
  { c_digo_dane_del_departamento: '85', departamento: 'Casanare', region: 'Unknown' },
  { c_digo_dane_del_departamento: '86', departamento: 'Putumayo', region: 'Unknown' },
  { c_digo_dane_del_departamento: '88', departamento: 'Archipielago De San Andres, Providencia Y Santa Catalina', region: 'Unknown' },
  { c_digo_dane_del_departamento: '91', departamento: 'Amazonas', region: 'Unknown' },
  { c_digo_dane_del_departamento: '94', departamento: 'Guainia', region: 'Unknown' },
  { c_digo_dane_del_departamento: '95', departamento: 'Guaviare', region: 'Unknown' },
  { c_digo_dane_del_departamento: '97', departamento: 'Vaupes', region: 'Unknown' },
  { c_digo_dane_del_departamento: '99', departamento: 'Vichada', region: 'Unknown' },
  { c_digo_dane_del_departamento: '97', departamento: 'Vaupes', region: 'Unknown' },
  { c_digo_dane_del_departamento: '97', departamento: 'Vaupes', region: 'Unknown' }
]

export const PLACES: Place[] = [
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.001',
    municipio: 'Medellin',
    cName: 'Medellin',
    ctId: '05.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.002',
    municipio: 'Abejorral',
    cName: 'Abejorral',
    ctId: '05.002'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.004',
    municipio: 'Abriaqui',
    cName: 'Abriaqui',
    ctId: '05.004'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.021',
    municipio: 'Alejandria',
    cName: 'Alejandria',
    ctId: '05.021'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.030',
    municipio: 'Amaga',
    cName: 'Amaga',
    ctId: '05.030'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.031',
    municipio: 'Amalfi',
    cName: 'Amalfi',
    ctId: '05.031'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.034',
    municipio: 'Andes',
    cName: 'Andes',
    ctId: '05.034'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.036',
    municipio: 'Angelopolis',
    cName: 'Angelopolis',
    ctId: '05.036'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.038',
    municipio: 'Angostura',
    cName: 'Angostura',
    ctId: '05.038'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.040',
    municipio: 'Anori',
    cName: 'Anori',
    ctId: '05.040'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.042',
    municipio: 'Antioquia',
    cName: 'Antioquia',
    ctId: '05.042'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.044',
    municipio: 'Anza',
    cName: 'Anza',
    ctId: '05.044'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.045',
    municipio: 'Apartado',
    cName: 'Apartado',
    ctId: '05.045'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.051',
    municipio: 'Arboletes',
    cName: 'Arboletes',
    ctId: '05.051'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.055',
    municipio: 'Argelia',
    cName: 'Argelia',
    ctId: '05.055'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.059',
    municipio: 'Armenia',
    cName: 'Armenia',
    ctId: '05.059'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.079',
    municipio: 'Barbosa',
    cName: 'Barbosa',
    ctId: '05.079'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.086',
    municipio: 'Belmira',
    cName: 'Belmira',
    ctId: '05.086'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.088',
    municipio: 'Bello',
    cName: 'Bello',
    ctId: '05.088'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.091',
    municipio: 'Betania',
    cName: 'Betania',
    ctId: '05.091'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.093',
    municipio: 'Betulia',
    cName: 'Betulia',
    ctId: '05.093'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.101',
    municipio: 'Bolivar',
    cName: 'Bolivar',
    ctId: '05.101'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.107',
    municipio: 'Briceño',
    cName: 'Briceño',
    ctId: '05.107'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.113',
    municipio: 'Buritica',
    cName: 'Buritica',
    ctId: '05.113'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.120',
    municipio: 'Caceres',
    cName: 'Caceres',
    ctId: '05.120'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.125',
    municipio: 'Caicedo',
    cName: 'Caicedo',
    ctId: '05.125'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.129',
    municipio: 'Caldas',
    cName: 'Caldas',
    ctId: '05.129'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.134',
    municipio: 'Campamento',
    cName: 'Campamento',
    ctId: '05.134'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.138',
    municipio: 'Cañasgordas',
    cName: 'Cañasgordas',
    ctId: '05.138'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.142',
    municipio: 'Caracoli',
    cName: 'Caracoli',
    ctId: '05.142'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.145',
    municipio: 'Caramanta',
    cName: 'Caramanta',
    ctId: '05.145'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.147',
    municipio: 'Carepa',
    cName: 'Carepa',
    ctId: '05.147'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.148',
    municipio: 'Carmen De Viboral',
    cName: 'Carmen De Viboral',
    ctId: '05.148'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.150',
    municipio: 'Carolina',
    cName: 'Carolina',
    ctId: '05.150'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.154',
    municipio: 'Caucasia',
    cName: 'Caucasia',
    ctId: '05.154'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.172',
    municipio: 'Chigorodo',
    cName: 'Chigorodo',
    ctId: '05.172'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.190',
    municipio: 'Cisneros',
    cName: 'Cisneros',
    ctId: '05.190'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.197',
    municipio: 'Cocorna',
    cName: 'Cocorna',
    ctId: '05.197'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.206',
    municipio: 'Concepcion',
    cName: 'Concepcion',
    ctId: '05.206'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.209',
    municipio: 'Concordia',
    cName: 'Concordia',
    ctId: '05.209'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.212',
    municipio: 'Copacabana',
    cName: 'Copacabana',
    ctId: '05.212'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.234',
    municipio: 'Dabeiba',
    cName: 'Dabeiba',
    ctId: '05.234'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.237',
    municipio: 'Don Matias',
    cName: 'Don Matias',
    ctId: '05.237'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.240',
    municipio: 'Ebejico',
    cName: 'Ebejico',
    ctId: '05.240'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.250',
    municipio: 'El Bagre',
    cName: 'El Bagre',
    ctId: '05.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.264',
    municipio: 'Entrerrios',
    cName: 'Entrerrios',
    ctId: '05.264'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.266',
    municipio: 'Envigado',
    cName: 'Envigado',
    ctId: '05.266'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.282',
    municipio: 'Fredonia',
    cName: 'Fredonia',
    ctId: '05.282'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.284',
    municipio: 'Frontino',
    cName: 'Frontino',
    ctId: '05.284'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.306',
    municipio: 'Giraldo',
    cName: 'Giraldo',
    ctId: '05.306'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.308',
    municipio: 'Girardota',
    cName: 'Girardota',
    ctId: '05.308'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.310',
    municipio: 'Gomez Plata',
    cName: 'Gomez Plata',
    ctId: '05.310'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.313',
    municipio: 'Granada',
    cName: 'Granada',
    ctId: '05.313'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.315',
    municipio: 'Guadalupe',
    cName: 'Guadalupe',
    ctId: '05.315'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.318',
    municipio: 'Guarne',
    cName: 'Guarne',
    ctId: '05.318'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.321',
    municipio: 'Guatape',
    cName: 'Guatape',
    ctId: '05.321'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.347',
    municipio: 'Heliconia',
    cName: 'Heliconia',
    ctId: '05.347'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.353',
    municipio: 'Hispania',
    cName: 'Hispania',
    ctId: '05.353'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.360',
    municipio: 'Itagui',
    cName: 'Itagui',
    ctId: '05.360'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.361',
    municipio: 'Ituango',
    cName: 'Ituango',
    ctId: '05.361'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.364',
    municipio: 'Jardin',
    cName: 'Jardin',
    ctId: '05.364'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.368',
    municipio: 'Jerico',
    cName: 'Jerico',
    ctId: '05.368'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.376',
    municipio: 'La Ceja',
    cName: 'La Ceja',
    ctId: '05.376'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.380',
    municipio: 'La Estrella',
    cName: 'La Estrella',
    ctId: '05.380'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.390',
    municipio: 'La Pintada',
    cName: 'La Pintada',
    ctId: '05.390'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.400',
    municipio: 'La Union',
    cName: 'La Union',
    ctId: '05.400'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.411',
    municipio: 'Liborina',
    cName: 'Liborina',
    ctId: '05.411'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.425',
    municipio: 'Maceo',
    cName: 'Maceo',
    ctId: '05.425'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.440',
    municipio: 'Marinilla',
    cName: 'Marinilla',
    ctId: '05.440'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.467',
    municipio: 'Montebello',
    cName: 'Montebello',
    ctId: '05.467'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.475',
    municipio: 'Murindo',
    cName: 'Murindo',
    ctId: '05.475'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.480',
    municipio: 'Mutata',
    cName: 'Mutata',
    ctId: '05.480'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.483',
    municipio: 'Nariño',
    cName: 'Nariño',
    ctId: '05.483'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.490',
    municipio: 'Necocli',
    cName: 'Necocli',
    ctId: '05.490'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.495',
    municipio: 'Nechi',
    cName: 'Nechi',
    ctId: '05.495'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.501',
    municipio: 'Olaya',
    cName: 'Olaya',
    ctId: '05.501'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.541',
    municipio: 'Peñol',
    cName: 'Peñol',
    ctId: '05.541'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.543',
    municipio: 'Peque',
    cName: 'Peque',
    ctId: '05.543'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.576',
    municipio: 'Pueblorrico',
    cName: 'Pueblorrico',
    ctId: '05.576'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.579',
    municipio: 'Puerto Berrio',
    cName: 'Puerto Berrio',
    ctId: '05.579'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.585',
    municipio: 'Puerto Nare (la\nmagdalena)',
    cName: 'Puerto Nare (la\nmagdalena)',
    ctId: '05.585'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.591',
    municipio: 'Puerto Triunfo',
    cName: 'Puerto Triunfo',
    ctId: '05.591'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.604',
    municipio: 'Remedios',
    cName: 'Remedios',
    ctId: '05.604'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.607',
    municipio: 'Retiro',
    cName: 'Retiro',
    ctId: '05.607'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.615',
    municipio: 'Rionegro',
    cName: 'Rionegro',
    ctId: '05.615'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.628',
    municipio: 'Sabanalarga',
    cName: 'Sabanalarga',
    ctId: '05.628'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.631',
    municipio: 'Sabaneta',
    cName: 'Sabaneta',
    ctId: '05.631'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.642',
    municipio: 'Salgar',
    cName: 'Salgar',
    ctId: '05.642'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.647',
    municipio: 'San Andres',
    cName: 'San Andres',
    ctId: '05.647'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.649',
    municipio: 'San Carlos',
    cName: 'San Carlos',
    ctId: '05.649'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.652',
    municipio: 'San Francisco',
    cName: 'San Francisco',
    ctId: '05.652'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.656',
    municipio: 'San Jeronimo',
    cName: 'San Jeronimo',
    ctId: '05.656'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.658',
    municipio: 'San Jose De La Montaña',
    cName: 'San Jose De La Montaña',
    ctId: '05.658'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.659',
    municipio: 'San Juan De Uraba',
    cName: 'San Juan De Uraba',
    ctId: '05.659'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.660',
    municipio: 'San Luis',
    cName: 'San Luis',
    ctId: '05.660'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.664',
    municipio: 'San Pedro',
    cName: 'San Pedro',
    ctId: '05.664'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.665',
    municipio: 'San Pedro De Uraba',
    cName: 'San Pedro De Uraba',
    ctId: '05.665'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.667',
    municipio: 'San Rafael',
    cName: 'San Rafael',
    ctId: '05.667'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.670',
    municipio: 'San Roque',
    cName: 'San Roque',
    ctId: '05.670'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.674',
    municipio: 'San Vicente',
    cName: 'San Vicente',
    ctId: '05.674'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.679',
    municipio: 'Santa Barbara',
    cName: 'Santa Barbara',
    ctId: '05.679'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.686',
    municipio: 'Santa Rosa De Osos',
    cName: 'Santa Rosa De Osos',
    ctId: '05.686'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.690',
    municipio: 'Santo Domingo',
    cName: 'Santo Domingo',
    ctId: '05.690'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.697',
    municipio: 'Santuario',
    cName: 'Santuario',
    ctId: '05.697'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.736',
    municipio: 'Segovia',
    cName: 'Segovia',
    ctId: '05.736'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.756',
    municipio: 'Sonson',
    cName: 'Sonson',
    ctId: '05.756'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.761',
    municipio: 'Sopetran',
    cName: 'Sopetran',
    ctId: '05.761'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.789',
    municipio: 'Tamesis',
    cName: 'Tamesis',
    ctId: '05.789'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.790',
    municipio: 'Taraza',
    cName: 'Taraza',
    ctId: '05.790'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.792',
    municipio: 'Tarso',
    cName: 'Tarso',
    ctId: '05.792'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.809',
    municipio: 'Titiribi',
    cName: 'Titiribi',
    ctId: '05.809'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.819',
    municipio: 'Toledo',
    cName: 'Toledo',
    ctId: '05.819'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.837',
    municipio: 'Turbo',
    cName: 'Turbo',
    ctId: '05.837'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.842',
    municipio: 'Uramita',
    cName: 'Uramita',
    ctId: '05.842'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.847',
    municipio: 'Urrao',
    cName: 'Urrao',
    ctId: '05.847'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.854',
    municipio: 'Valdivia',
    cName: 'Valdivia',
    ctId: '05.854'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.856',
    municipio: 'Valparaiso',
    cName: 'Valparaiso',
    ctId: '05.856'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.858',
    municipio: 'Vegachi',
    cName: 'Vegachi',
    ctId: '05.858'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.861',
    municipio: 'Venecia',
    cName: 'Venecia',
    ctId: '05.861'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.873',
    municipio: 'Vigia Del Fuerte',
    cName: 'Vigia Del Fuerte',
    ctId: '05.873'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.885',
    municipio: 'Yali',
    cName: 'Yali',
    ctId: '05.885'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.887',
    municipio: 'Yarumal',
    cName: 'Yarumal',
    ctId: '05.887'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.890',
    municipio: 'Yolombo',
    cName: 'Yolombo',
    ctId: '05.890'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.893',
    municipio: 'Yondo',
    cName: 'Yondo',
    ctId: '05.893'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '05',
    departamento: 'Antioquia',
    c_digo_dane_del_municipio: '05.895',
    municipio: 'Zaragoza',
    cName: 'Zaragoza',
    ctId: '05.895'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.001',
    municipio: 'Barranquilla (distrito Especial, Industrial Y Portuario De\nbarranquilla)',
    cName: 'Barranquilla (distrito Especial, Industrial Y Portuario De\nbarranquilla)',
    ctId: '08.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.078',
    municipio: 'Baranoa',
    cName: 'Baranoa',
    ctId: '08.078'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.137',
    municipio: 'Campo De La Cruz',
    cName: 'Campo De La Cruz',
    ctId: '08.137'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.141',
    municipio: 'Candelaria',
    cName: 'Candelaria',
    ctId: '08.141'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.296',
    municipio: 'Galapa',
    cName: 'Galapa',
    ctId: '08.296'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.372',
    municipio: 'Juan De Acosta',
    cName: 'Juan De Acosta',
    ctId: '08.372'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.421',
    municipio: 'Luruaco',
    cName: 'Luruaco',
    ctId: '08.421'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.433',
    municipio: 'Malambo',
    cName: 'Malambo',
    ctId: '08.433'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.436',
    municipio: 'Manati',
    cName: 'Manati',
    ctId: '08.436'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.520',
    municipio: 'Palmar De Varela',
    cName: 'Palmar De Varela',
    ctId: '08.520'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.549',
    municipio: 'Piojo',
    cName: 'Piojo',
    ctId: '08.549'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.558',
    municipio: 'Polo Nuevo',
    cName: 'Polo Nuevo',
    ctId: '08.558'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.560',
    municipio: 'Ponedera',
    cName: 'Ponedera',
    ctId: '08.560'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.573',
    municipio: 'Puerto Colombia',
    cName: 'Puerto Colombia',
    ctId: '08.573'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.606',
    municipio: 'Repelon',
    cName: 'Repelon',
    ctId: '08.606'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.634',
    municipio: 'Sabanagrande',
    cName: 'Sabanagrande',
    ctId: '08.634'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.638',
    municipio: 'Sabanalarga',
    cName: 'Sabanalarga',
    ctId: '08.638'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.675',
    municipio: 'Santa Lucia',
    cName: 'Santa Lucia',
    ctId: '08.675'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.685',
    municipio: 'Santo Tomas',
    cName: 'Santo Tomas',
    ctId: '08.685'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.758',
    municipio: 'Soledad',
    cName: 'Soledad',
    ctId: '08.758'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.770',
    municipio: 'Suan',
    cName: 'Suan',
    ctId: '08.770'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.832',
    municipio: 'Tubara',
    cName: 'Tubara',
    ctId: '08.832'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '08',
    departamento: 'Atlantico',
    c_digo_dane_del_municipio: '08.849',
    municipio: 'Usiacuri',
    cName: 'Usiacuri',
    ctId: '08.849'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.001',
    municipio: 'Santa Fe De Bogota, D. C.',
    cName: 'Santa Fe De Bogota, D. C.',
    ctId: '11.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.001',
    municipio: 'Santafe De Bogota D.c.-\nusaquen',
    cName: 'Santafe De Bogota D.c.-\nusaquen',
    ctId: '11.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.002',
    municipio: 'Santafe De Bogota D.c.-\nchapinero',
    cName: 'Santafe De Bogota D.c.-\nchapinero',
    ctId: '11.002'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.003',
    municipio: 'Santafe De Bogota D.c.-\nsanta Fe',
    cName: 'Santafe De Bogota D.c.-\nsanta Fe',
    ctId: '11.003'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.004',
    municipio: 'Santafe De Bogota D.c.-\nsan Cristobal',
    cName: 'Santafe De Bogota D.c.-\nsan Cristobal',
    ctId: '11.004'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.005',
    municipio: 'Santafe De Bogota D.c.-\nusme',
    cName: 'Santafe De Bogota D.c.-\nusme',
    ctId: '11.005'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.006',
    municipio: 'Santafe De Bogota D.c.-\ntunjuelito',
    cName: 'Santafe De Bogota D.c.-\ntunjuelito',
    ctId: '11.006'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.007',
    municipio: 'Santafe De Bogota D.c.-\nbosa',
    cName: 'Santafe De Bogota D.c.-\nbosa',
    ctId: '11.007'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.008',
    municipio: 'Santafe De Bogota D.c.-\nkennedy',
    cName: 'Santafe De Bogota D.c.-\nkennedy',
    ctId: '11.008'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.009',
    municipio: 'Santafe De Bogota D.c.-\nfontibon',
    cName: 'Santafe De Bogota D.c.-\nfontibon',
    ctId: '11.009'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.010',
    municipio: 'Santafe De Bogota D.c.-\nengativa',
    cName: 'Santafe De Bogota D.c.-\nengativa',
    ctId: '11.010'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.011',
    municipio: 'Santafe De Bogota D.c.-\nsuba',
    cName: 'Santafe De Bogota D.c.-\nsuba',
    ctId: '11.011'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.012',
    municipio: 'Santafe De Bogota D.c.-\nbarrios Unidos',
    cName: 'Santafe De Bogota D.c.-\nbarrios Unidos',
    ctId: '11.012'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.013',
    municipio: 'Santafe De Bogota D.c.-\nteusaquillo',
    cName: 'Santafe De Bogota D.c.-\nteusaquillo',
    ctId: '11.013'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.014',
    municipio: 'Santafe De Bogota D.c.-\nmartires',
    cName: 'Santafe De Bogota D.c.-\nmartires',
    ctId: '11.014'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.015',
    municipio: 'Santafe De Bogota D.c.-\nantonio Nariño',
    cName: 'Santafe De Bogota D.c.-\nantonio Nariño',
    ctId: '11.015'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.016',
    municipio: 'Santafe De Bogota D.c.-\npuente Aranda',
    cName: 'Santafe De Bogota D.c.-\npuente Aranda',
    ctId: '11.016'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.017',
    municipio: 'Santafe De Bogota D.c.-\ncandelaria',
    cName: 'Santafe De Bogota D.c.-\ncandelaria',
    ctId: '11.017'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.018',
    municipio: 'Santafe De Bogota D.c.-\nrafael Uribe',
    cName: 'Santafe De Bogota D.c.-\nrafael Uribe',
    ctId: '11.018'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.019',
    municipio: 'Santafe De Bogota D.c.-\nciudad Bolivar',
    cName: 'Santafe De Bogota D.c.-\nciudad Bolivar',
    ctId: '11.019'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '11',
    departamento: 'Santa Fe de Bogotá',
    c_digo_dane_del_municipio: '11.020',
    municipio: 'Santafe De Bogota D.c.-\nsumapaz',
    cName: 'Santafe De Bogota D.c.-\nsumapaz',
    ctId: '11.020'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.001',
    municipio: 'Cartagena (distrito Turistico Y Cultural De\ncartagena)',
    cName: 'Cartagena (distrito Turistico Y Cultural De\ncartagena)',
    ctId: '13.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.006',
    municipio: 'Achi',
    cName: 'Achi',
    ctId: '13.006'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.030',
    municipio: 'Altos Del Rosario',
    cName: 'Altos Del Rosario',
    ctId: '13.030'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.042',
    municipio: 'Arenal',
    cName: 'Arenal',
    ctId: '13.042'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.052',
    municipio: 'Arjona',
    cName: 'Arjona',
    ctId: '13.052'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.062',
    municipio: 'Arroyohondo',
    cName: 'Arroyohondo',
    ctId: '13.062'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.074',
    municipio: 'Barranco De Loba',
    cName: 'Barranco De Loba',
    ctId: '13.074'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.140',
    municipio: 'Calamar',
    cName: 'Calamar',
    ctId: '13.140'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.160',
    municipio: 'Cantagallo',
    cName: 'Cantagallo',
    ctId: '13.160'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.188',
    municipio: 'Cicuco',
    cName: 'Cicuco',
    ctId: '13.188'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.212',
    municipio: 'Cordoba',
    cName: 'Cordoba',
    ctId: '13.212'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.222',
    municipio: 'Clemencia',
    cName: 'Clemencia',
    ctId: '13.222'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.244',
    municipio: 'El Carmen De Bolivar',
    cName: 'El Carmen De Bolivar',
    ctId: '13.244'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.248',
    municipio: 'El Guamo',
    cName: 'El Guamo',
    ctId: '13.248'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.268',
    municipio: 'El Peñon',
    cName: 'El Peñon',
    ctId: '13.268'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.300',
    municipio: 'Hatillo De Loba',
    cName: 'Hatillo De Loba',
    ctId: '13.300'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.430',
    municipio: 'Magangue',
    cName: 'Magangue',
    ctId: '13.430'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.433',
    municipio: 'Mahates',
    cName: 'Mahates',
    ctId: '13.433'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.440',
    municipio: 'Margarita',
    cName: 'Margarita',
    ctId: '13.440'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.442',
    municipio: 'Maria La Baja',
    cName: 'Maria La Baja',
    ctId: '13.442'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.458',
    municipio: 'Montecristo',
    cName: 'Montecristo',
    ctId: '13.458'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.468',
    municipio: 'Mompos',
    cName: 'Mompos',
    ctId: '13.468'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.473',
    municipio: 'Morales',
    cName: 'Morales',
    ctId: '13.473'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.549',
    municipio: 'Pinillos',
    cName: 'Pinillos',
    ctId: '13.549'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.580',
    municipio: 'Regidor',
    cName: 'Regidor',
    ctId: '13.580'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.600',
    municipio: 'Rio Viejo',
    cName: 'Rio Viejo',
    ctId: '13.600'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.620',
    municipio: 'San Cristobal',
    cName: 'San Cristobal',
    ctId: '13.620'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.647',
    municipio: 'San Estanislao',
    cName: 'San Estanislao',
    ctId: '13.647'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.650',
    municipio: 'San Fernando',
    cName: 'San Fernando',
    ctId: '13.650'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.654',
    municipio: 'San Jacinto',
    cName: 'San Jacinto',
    ctId: '13.654'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.655',
    municipio: 'San Jacinto Del Cauca',
    cName: 'San Jacinto Del Cauca',
    ctId: '13.655'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.657',
    municipio: 'San Juan Nepomuceno',
    cName: 'San Juan Nepomuceno',
    ctId: '13.657'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.667',
    municipio: 'San Martin De Loba',
    cName: 'San Martin De Loba',
    ctId: '13.667'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.670',
    municipio: 'San Pablo',
    cName: 'San Pablo',
    ctId: '13.670'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.673',
    municipio: 'Santa Catalina',
    cName: 'Santa Catalina',
    ctId: '13.673'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.683',
    municipio: 'Santa Rosa',
    cName: 'Santa Rosa',
    ctId: '13.683'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.688',
    municipio: 'Santa Rosa Del Sur',
    cName: 'Santa Rosa Del Sur',
    ctId: '13.688'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.744',
    municipio: 'Simiti',
    cName: 'Simiti',
    ctId: '13.744'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.760',
    municipio: 'Soplaviento',
    cName: 'Soplaviento',
    ctId: '13.760'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.780',
    municipio: 'Talaigua Nuevo',
    cName: 'Talaigua Nuevo',
    ctId: '13.780'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.810',
    municipio: 'Tiquisio (puerto Rico)',
    cName: 'Tiquisio (puerto Rico)',
    ctId: '13.810'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.836',
    municipio: 'Turbaco',
    cName: 'Turbaco',
    ctId: '13.836'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.838',
    municipio: 'Turbana',
    cName: 'Turbana',
    ctId: '13.838'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.873',
    municipio: 'Villanueva',
    cName: 'Villanueva',
    ctId: '13.873'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '13',
    departamento: 'Bolivar',
    c_digo_dane_del_municipio: '13.894',
    municipio: 'Zambrano',
    cName: 'Zambrano',
    ctId: '13.894'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.001',
    municipio: 'Tunja',
    cName: 'Tunja',
    ctId: '15.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.022',
    municipio: 'Almeida',
    cName: 'Almeida',
    ctId: '15.022'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.047',
    municipio: 'Aquitania',
    cName: 'Aquitania',
    ctId: '15.047'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.051',
    municipio: 'Arcabuco',
    cName: 'Arcabuco',
    ctId: '15.051'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.087',
    municipio: 'Belen',
    cName: 'Belen',
    ctId: '15.087'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.090',
    municipio: 'Berbeo',
    cName: 'Berbeo',
    ctId: '15.090'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.092',
    municipio: 'Beteitiva',
    cName: 'Beteitiva',
    ctId: '15.092'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.097',
    municipio: 'Boavita',
    cName: 'Boavita',
    ctId: '15.097'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.104',
    municipio: 'Boyaca',
    cName: 'Boyaca',
    ctId: '15.104'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.106',
    municipio: 'Briceño',
    cName: 'Briceño',
    ctId: '15.106'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.109',
    municipio: 'Buenavista',
    cName: 'Buenavista',
    ctId: '15.109'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.114',
    municipio: 'Busbanza',
    cName: 'Busbanza',
    ctId: '15.114'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.131',
    municipio: 'Caldas',
    cName: 'Caldas',
    ctId: '15.131'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.135',
    municipio: 'Campohermoso',
    cName: 'Campohermoso',
    ctId: '15.135'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.162',
    municipio: 'Cerinza',
    cName: 'Cerinza',
    ctId: '15.162'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.172',
    municipio: 'Chinavita',
    cName: 'Chinavita',
    ctId: '15.172'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.176',
    municipio: 'Chiquinquira',
    cName: 'Chiquinquira',
    ctId: '15.176'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.180',
    municipio: 'Chiscas',
    cName: 'Chiscas',
    ctId: '15.180'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.183',
    municipio: 'Chita',
    cName: 'Chita',
    ctId: '15.183'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.185',
    municipio: 'Chitaraque',
    cName: 'Chitaraque',
    ctId: '15.185'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.187',
    municipio: 'Chivata',
    cName: 'Chivata',
    ctId: '15.187'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.189',
    municipio: 'Cienega',
    cName: 'Cienega',
    ctId: '15.189'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.204',
    municipio: 'Combita',
    cName: 'Combita',
    ctId: '15.204'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.212',
    municipio: 'Coper',
    cName: 'Coper',
    ctId: '15.212'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.215',
    municipio: 'Corrales',
    cName: 'Corrales',
    ctId: '15.215'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.218',
    municipio: 'Covarachia',
    cName: 'Covarachia',
    ctId: '15.218'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.223',
    municipio: 'Cubara',
    cName: 'Cubara',
    ctId: '15.223'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.224',
    municipio: 'Cucaita',
    cName: 'Cucaita',
    ctId: '15.224'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.226',
    municipio: 'Cuitiva',
    cName: 'Cuitiva',
    ctId: '15.226'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.232',
    municipio: 'Chiquiza',
    cName: 'Chiquiza',
    ctId: '15.232'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.236',
    municipio: 'Chivor',
    cName: 'Chivor',
    ctId: '15.236'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.238',
    municipio: 'Duitama',
    cName: 'Duitama',
    ctId: '15.238'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.244',
    municipio: 'El Cocuy',
    cName: 'El Cocuy',
    ctId: '15.244'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.248',
    municipio: 'El Espino',
    cName: 'El Espino',
    ctId: '15.248'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.272',
    municipio: 'Firavitoba',
    cName: 'Firavitoba',
    ctId: '15.272'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.276',
    municipio: 'Floresta',
    cName: 'Floresta',
    ctId: '15.276'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.293',
    municipio: 'Gachantiva',
    cName: 'Gachantiva',
    ctId: '15.293'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.296',
    municipio: 'Gameza',
    cName: 'Gameza',
    ctId: '15.296'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.299',
    municipio: 'Garagoa',
    cName: 'Garagoa',
    ctId: '15.299'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.317',
    municipio: 'Guacamayas',
    cName: 'Guacamayas',
    ctId: '15.317'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.322',
    municipio: 'Guateque',
    cName: 'Guateque',
    ctId: '15.322'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.325',
    municipio: 'Guayata',
    cName: 'Guayata',
    ctId: '15.325'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.332',
    municipio: 'Guican',
    cName: 'Guican',
    ctId: '15.332'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.362',
    municipio: 'Iza',
    cName: 'Iza',
    ctId: '15.362'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.367',
    municipio: 'Jenesano',
    cName: 'Jenesano',
    ctId: '15.367'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.368',
    municipio: 'Jerico',
    cName: 'Jerico',
    ctId: '15.368'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.377',
    municipio: 'Labranzagrande',
    cName: 'Labranzagrande',
    ctId: '15.377'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.380',
    municipio: 'La Capilla',
    cName: 'La Capilla',
    ctId: '15.380'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.401',
    municipio: 'La Victoria',
    cName: 'La Victoria',
    ctId: '15.401'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.403',
    municipio: 'La Uvita',
    cName: 'La Uvita',
    ctId: '15.403'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.407',
    municipio: 'Villa De Leiva',
    cName: 'Villa De Leiva',
    ctId: '15.407'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.425',
    municipio: 'Macanal',
    cName: 'Macanal',
    ctId: '15.425'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.442',
    municipio: 'Maripi',
    cName: 'Maripi',
    ctId: '15.442'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.455',
    municipio: 'Miraflores',
    cName: 'Miraflores',
    ctId: '15.455'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.464',
    municipio: 'Mongua',
    cName: 'Mongua',
    ctId: '15.464'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.466',
    municipio: 'Mongui',
    cName: 'Mongui',
    ctId: '15.466'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.469',
    municipio: 'Moniquira',
    cName: 'Moniquira',
    ctId: '15.469'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.476',
    municipio: 'Motavita',
    cName: 'Motavita',
    ctId: '15.476'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.480',
    municipio: 'Muzo',
    cName: 'Muzo',
    ctId: '15.480'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.491',
    municipio: 'Nobsa',
    cName: 'Nobsa',
    ctId: '15.491'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.494',
    municipio: 'Nuevo Colon',
    cName: 'Nuevo Colon',
    ctId: '15.494'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.500',
    municipio: 'Oicata',
    cName: 'Oicata',
    ctId: '15.500'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.507',
    municipio: 'Otanche',
    cName: 'Otanche',
    ctId: '15.507'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.511',
    municipio: 'Pachavita',
    cName: 'Pachavita',
    ctId: '15.511'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.514',
    municipio: 'Paez',
    cName: 'Paez',
    ctId: '15.514'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.516',
    municipio: 'Paipa',
    cName: 'Paipa',
    ctId: '15.516'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.518',
    municipio: 'Pajarito',
    cName: 'Pajarito',
    ctId: '15.518'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.522',
    municipio: 'Panqueba',
    cName: 'Panqueba',
    ctId: '15.522'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.531',
    municipio: 'Pauna',
    cName: 'Pauna',
    ctId: '15.531'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.533',
    municipio: 'Paya',
    cName: 'Paya',
    ctId: '15.533'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.537',
    municipio: 'Paz Del Rio',
    cName: 'Paz Del Rio',
    ctId: '15.537'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.542',
    municipio: 'Pesca',
    cName: 'Pesca',
    ctId: '15.542'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.550',
    municipio: 'Pisba',
    cName: 'Pisba',
    ctId: '15.550'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.572',
    municipio: 'Puerto Boyaca',
    cName: 'Puerto Boyaca',
    ctId: '15.572'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.580',
    municipio: 'Quipama',
    cName: 'Quipama',
    ctId: '15.580'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.599',
    municipio: 'Ramiriqui',
    cName: 'Ramiriqui',
    ctId: '15.599'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.600',
    municipio: 'Raquira',
    cName: 'Raquira',
    ctId: '15.600'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.621',
    municipio: 'Rondon',
    cName: 'Rondon',
    ctId: '15.621'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.632',
    municipio: 'Saboya',
    cName: 'Saboya',
    ctId: '15.632'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.638',
    municipio: 'Sachica',
    cName: 'Sachica',
    ctId: '15.638'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.646',
    municipio: 'Samaca',
    cName: 'Samaca',
    ctId: '15.646'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.660',
    municipio: 'San Eduardo',
    cName: 'San Eduardo',
    ctId: '15.660'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.664',
    municipio: 'San Jose De Pare',
    cName: 'San Jose De Pare',
    ctId: '15.664'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.667',
    municipio: 'San Luis De Gaceno',
    cName: 'San Luis De Gaceno',
    ctId: '15.667'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.673',
    municipio: 'San Mateo',
    cName: 'San Mateo',
    ctId: '15.673'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.676',
    municipio: 'San Miguel De Sema',
    cName: 'San Miguel De Sema',
    ctId: '15.676'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.681',
    municipio: 'San Pablo De Borbur',
    cName: 'San Pablo De Borbur',
    ctId: '15.681'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.686',
    municipio: 'Santana',
    cName: 'Santana',
    ctId: '15.686'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.690',
    municipio: 'Santa Maria',
    cName: 'Santa Maria',
    ctId: '15.690'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.693',
    municipio: 'Santa Rosa De Viterbo',
    cName: 'Santa Rosa De Viterbo',
    ctId: '15.693'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.696',
    municipio: 'Santa Sofia',
    cName: 'Santa Sofia',
    ctId: '15.696'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.720',
    municipio: 'Sativanorte',
    cName: 'Sativanorte',
    ctId: '15.720'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.723',
    municipio: 'Sativasur',
    cName: 'Sativasur',
    ctId: '15.723'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.740',
    municipio: 'Siachoque',
    cName: 'Siachoque',
    ctId: '15.740'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.753',
    municipio: 'Soata',
    cName: 'Soata',
    ctId: '15.753'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.755',
    municipio: 'Socota',
    cName: 'Socota',
    ctId: '15.755'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.757',
    municipio: 'Socha',
    cName: 'Socha',
    ctId: '15.757'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.759',
    municipio: 'Sogamoso',
    cName: 'Sogamoso',
    ctId: '15.759'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.761',
    municipio: 'Somondoco',
    cName: 'Somondoco',
    ctId: '15.761'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.762',
    municipio: 'Sora',
    cName: 'Sora',
    ctId: '15.762'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.763',
    municipio: 'Sotaquira',
    cName: 'Sotaquira',
    ctId: '15.763'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.764',
    municipio: 'Soraca',
    cName: 'Soraca',
    ctId: '15.764'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.774',
    municipio: 'Susacon',
    cName: 'Susacon',
    ctId: '15.774'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.776',
    municipio: 'Sutamarchan',
    cName: 'Sutamarchan',
    ctId: '15.776'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.778',
    municipio: 'Sutatenza',
    cName: 'Sutatenza',
    ctId: '15.778'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.790',
    municipio: 'Tasco',
    cName: 'Tasco',
    ctId: '15.790'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.798',
    municipio: 'Tenza',
    cName: 'Tenza',
    ctId: '15.798'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.804',
    municipio: 'Tibana',
    cName: 'Tibana',
    ctId: '15.804'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.806',
    municipio: 'Tibasosa',
    cName: 'Tibasosa',
    ctId: '15.806'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.808',
    municipio: 'Tinjaca',
    cName: 'Tinjaca',
    ctId: '15.808'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.810',
    municipio: 'Tipacoque',
    cName: 'Tipacoque',
    ctId: '15.810'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.814',
    municipio: 'Toca',
    cName: 'Toca',
    ctId: '15.814'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.816',
    municipio: 'Togui',
    cName: 'Togui',
    ctId: '15.816'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.820',
    municipio: 'Topaga',
    cName: 'Topaga',
    ctId: '15.820'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.822',
    municipio: 'Tota',
    cName: 'Tota',
    ctId: '15.822'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.832',
    municipio: 'Tunungua',
    cName: 'Tunungua',
    ctId: '15.832'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.835',
    municipio: 'Turmeque',
    cName: 'Turmeque',
    ctId: '15.835'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.837',
    municipio: 'Tuta',
    cName: 'Tuta',
    ctId: '15.837'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.839',
    municipio: 'Tutasa',
    cName: 'Tutasa',
    ctId: '15.839'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.842',
    municipio: 'Umbita',
    cName: 'Umbita',
    ctId: '15.842'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.861',
    municipio: 'Ventaquemada',
    cName: 'Ventaquemada',
    ctId: '15.861'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.879',
    municipio: 'Viracacha',
    cName: 'Viracacha',
    ctId: '15.879'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '15',
    departamento: 'Boyaca',
    c_digo_dane_del_municipio: '15.897',
    municipio: 'Zetaquira',
    cName: 'Zetaquira',
    ctId: '15.897'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.001',
    municipio: 'Manizales',
    cName: 'Manizales',
    ctId: '17.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.013',
    municipio: 'Aguadas',
    cName: 'Aguadas',
    ctId: '17.013'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.042',
    municipio: 'Anserma',
    cName: 'Anserma',
    ctId: '17.042'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.050',
    municipio: 'Aranzazu',
    cName: 'Aranzazu',
    ctId: '17.050'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.088',
    municipio: 'Belalcazar',
    cName: 'Belalcazar',
    ctId: '17.088'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.174',
    municipio: 'Chinchina',
    cName: 'Chinchina',
    ctId: '17.174'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.272',
    municipio: 'Filadelfia',
    cName: 'Filadelfia',
    ctId: '17.272'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.380',
    municipio: 'La Dorada',
    cName: 'La Dorada',
    ctId: '17.380'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.388',
    municipio: 'La Merced',
    cName: 'La Merced',
    ctId: '17.388'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.433',
    municipio: 'Manzanares',
    cName: 'Manzanares',
    ctId: '17.433'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.442',
    municipio: 'Marmato',
    cName: 'Marmato',
    ctId: '17.442'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.444',
    municipio: 'Marquetalia',
    cName: 'Marquetalia',
    ctId: '17.444'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.446',
    municipio: 'Marulanda',
    cName: 'Marulanda',
    ctId: '17.446'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.486',
    municipio: 'Neira',
    cName: 'Neira',
    ctId: '17.486'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.495',
    municipio: 'Norcasia',
    cName: 'Norcasia',
    ctId: '17.495'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.513',
    municipio: 'Pacora',
    cName: 'Pacora',
    ctId: '17.513'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.524',
    municipio: 'Palestina',
    cName: 'Palestina',
    ctId: '17.524'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.541',
    municipio: 'Pensilvania',
    cName: 'Pensilvania',
    ctId: '17.541'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.614',
    municipio: 'Riosucio',
    cName: 'Riosucio',
    ctId: '17.614'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.616',
    municipio: 'Risaralda',
    cName: 'Risaralda',
    ctId: '17.616'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.653',
    municipio: 'Salamina',
    cName: 'Salamina',
    ctId: '17.653'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.662',
    municipio: 'Samana',
    cName: 'Samana',
    ctId: '17.662'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.665',
    municipio: 'San Jose',
    cName: 'San Jose',
    ctId: '17.665'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.777',
    municipio: 'Supia',
    cName: 'Supia',
    ctId: '17.777'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.867',
    municipio: 'Victoria',
    cName: 'Victoria',
    ctId: '17.867'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.873',
    municipio: 'Villamaria',
    cName: 'Villamaria',
    ctId: '17.873'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '17',
    departamento: 'Caldas',
    c_digo_dane_del_municipio: '17.877',
    municipio: 'Viterbo',
    cName: 'Viterbo',
    ctId: '17.877'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.001',
    municipio: 'Florencia',
    cName: 'Florencia',
    ctId: '18.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.029',
    municipio: 'Albania',
    cName: 'Albania',
    ctId: '18.029'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.094',
    municipio: 'Belen De Los Andaquies',
    cName: 'Belen De Los Andaquies',
    ctId: '18.094'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.150',
    municipio: 'Cartagena Del Chaira',
    cName: 'Cartagena Del Chaira',
    ctId: '18.150'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.205',
    municipio: 'Curillo',
    cName: 'Curillo',
    ctId: '18.205'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.247',
    municipio: 'El Doncello',
    cName: 'El Doncello',
    ctId: '18.247'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.256',
    municipio: 'El Paujil',
    cName: 'El Paujil',
    ctId: '18.256'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.410',
    municipio: 'La Montañita',
    cName: 'La Montañita',
    ctId: '18.410'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.460',
    municipio: 'Milan',
    cName: 'Milan',
    ctId: '18.460'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.479',
    municipio: 'Morelia',
    cName: 'Morelia',
    ctId: '18.479'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.592',
    municipio: 'Puerto Rico',
    cName: 'Puerto Rico',
    ctId: '18.592'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.610',
    municipio: 'San Jose De Fragua',
    cName: 'San Jose De Fragua',
    ctId: '18.610'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.753',
    municipio: 'San  Vicente Del Caguan',
    cName: 'San  Vicente Del Caguan',
    ctId: '18.753'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.756',
    municipio: 'Solano',
    cName: 'Solano',
    ctId: '18.756'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.785',
    municipio: 'Solita',
    cName: 'Solita',
    ctId: '18.785'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '18',
    departamento: 'Caqueta',
    c_digo_dane_del_municipio: '18.860',
    municipio: 'Valparaiso',
    cName: 'Valparaiso',
    ctId: '18.860'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.001',
    municipio: 'Popayan',
    cName: 'Popayan',
    ctId: '19.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.022',
    municipio: 'Almaguer',
    cName: 'Almaguer',
    ctId: '19.022'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.050',
    municipio: 'Argelia',
    cName: 'Argelia',
    ctId: '19.050'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.075',
    municipio: 'Balboa',
    cName: 'Balboa',
    ctId: '19.075'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.100',
    municipio: 'Bolivar',
    cName: 'Bolivar',
    ctId: '19.100'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.110',
    municipio: 'Buenos Aires',
    cName: 'Buenos Aires',
    ctId: '19.110'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.130',
    municipio: 'Cajibio',
    cName: 'Cajibio',
    ctId: '19.130'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.137',
    municipio: 'Caldono',
    cName: 'Caldono',
    ctId: '19.137'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.142',
    municipio: 'Caloto',
    cName: 'Caloto',
    ctId: '19.142'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.212',
    municipio: 'Corinto',
    cName: 'Corinto',
    ctId: '19.212'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.256',
    municipio: 'El Tambo',
    cName: 'El Tambo',
    ctId: '19.256'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.290',
    municipio: 'Florencia',
    cName: 'Florencia',
    ctId: '19.290'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.318',
    municipio: 'Guapi',
    cName: 'Guapi',
    ctId: '19.318'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.355',
    municipio: 'Inza',
    cName: 'Inza',
    ctId: '19.355'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.364',
    municipio: 'Jambalo',
    cName: 'Jambalo',
    ctId: '19.364'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.392',
    municipio: 'La Sierra',
    cName: 'La Sierra',
    ctId: '19.392'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.397',
    municipio: 'La Vega',
    cName: 'La Vega',
    ctId: '19.397'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.418',
    municipio: 'Lopez (micay)',
    cName: 'Lopez (micay)',
    ctId: '19.418'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.450',
    municipio: 'Mercaderes',
    cName: 'Mercaderes',
    ctId: '19.450'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.455',
    municipio: 'Miranda',
    cName: 'Miranda',
    ctId: '19.455'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.473',
    municipio: 'Morales',
    cName: 'Morales',
    ctId: '19.473'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.513',
    municipio: 'Padilla',
    cName: 'Padilla',
    ctId: '19.513'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.517',
    municipio: 'Paez (belalcazar)',
    cName: 'Paez (belalcazar)',
    ctId: '19.517'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.532',
    municipio: 'Patia (el Bordo)',
    cName: 'Patia (el Bordo)',
    ctId: '19.532'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.533',
    municipio: 'Piamonte',
    cName: 'Piamonte',
    ctId: '19.533'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.548',
    municipio: 'Piendamo',
    cName: 'Piendamo',
    ctId: '19.548'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.573',
    municipio: 'Puerto Tejada',
    cName: 'Puerto Tejada',
    ctId: '19.573'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.585',
    municipio: 'Purace (coconuco)',
    cName: 'Purace (coconuco)',
    ctId: '19.585'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.622',
    municipio: 'Rosas',
    cName: 'Rosas',
    ctId: '19.622'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.693',
    municipio: 'San Sebastian',
    cName: 'San Sebastian',
    ctId: '19.693'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.698',
    municipio: 'Santander De Quilichao',
    cName: 'Santander De Quilichao',
    ctId: '19.698'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.701',
    municipio: 'Santa Rosa',
    cName: 'Santa Rosa',
    ctId: '19.701'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.743',
    municipio: 'Silvia',
    cName: 'Silvia',
    ctId: '19.743'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.760',
    municipio: 'Sotara (paispamba)',
    cName: 'Sotara (paispamba)',
    ctId: '19.760'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.780',
    municipio: 'Suarez',
    cName: 'Suarez',
    ctId: '19.780'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.807',
    municipio: 'Timbio',
    cName: 'Timbio',
    ctId: '19.807'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.809',
    municipio: 'Timbiqui',
    cName: 'Timbiqui',
    ctId: '19.809'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.821',
    municipio: 'Toribio',
    cName: 'Toribio',
    ctId: '19.821'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.824',
    municipio: 'Totoro',
    cName: 'Totoro',
    ctId: '19.824'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '19',
    departamento: 'Cauca',
    c_digo_dane_del_municipio: '19.845',
    municipio: 'Villarica',
    cName: 'Villarica',
    ctId: '19.845'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.001',
    municipio: 'Valledupar',
    cName: 'Valledupar',
    ctId: '20.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.011',
    municipio: 'Aguachica',
    cName: 'Aguachica',
    ctId: '20.011'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.013',
    municipio: 'Agustin Codazzi',
    cName: 'Agustin Codazzi',
    ctId: '20.013'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.032',
    municipio: 'Astrea',
    cName: 'Astrea',
    ctId: '20.032'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.045',
    municipio: 'Becerril',
    cName: 'Becerril',
    ctId: '20.045'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.060',
    municipio: 'Bosconia',
    cName: 'Bosconia',
    ctId: '20.060'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.175',
    municipio: 'Chimichagua',
    cName: 'Chimichagua',
    ctId: '20.175'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.178',
    municipio: 'Chiriguana',
    cName: 'Chiriguana',
    ctId: '20.178'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.228',
    municipio: 'Curumani',
    cName: 'Curumani',
    ctId: '20.228'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.238',
    municipio: 'El Copey',
    cName: 'El Copey',
    ctId: '20.238'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.250',
    municipio: 'El Paso',
    cName: 'El Paso',
    ctId: '20.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.295',
    municipio: 'Gamarra',
    cName: 'Gamarra',
    ctId: '20.295'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.310',
    municipio: 'Gonzalez',
    cName: 'Gonzalez',
    ctId: '20.310'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.383',
    municipio: 'La Gloria',
    cName: 'La Gloria',
    ctId: '20.383'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.400',
    municipio: 'La Jagua Ibirico',
    cName: 'La Jagua Ibirico',
    ctId: '20.400'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.443',
    municipio: 'Manaure (balcon Del\ncesar)',
    cName: 'Manaure (balcon Del\ncesar)',
    ctId: '20.443'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.517',
    municipio: 'Pailitas',
    cName: 'Pailitas',
    ctId: '20.517'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.550',
    municipio: 'Pelaya',
    cName: 'Pelaya',
    ctId: '20.550'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.570',
    municipio: 'Pueblo Bello',
    cName: 'Pueblo Bello',
    ctId: '20.570'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.614',
    municipio: 'Rio De Oro',
    cName: 'Rio De Oro',
    ctId: '20.614'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.621',
    municipio: 'La Paz (robles)',
    cName: 'La Paz (robles)',
    ctId: '20.621'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.710',
    municipio: 'San Alberto',
    cName: 'San Alberto',
    ctId: '20.710'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.750',
    municipio: 'San Diego',
    cName: 'San Diego',
    ctId: '20.750'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.770',
    municipio: 'San Martin',
    cName: 'San Martin',
    ctId: '20.770'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '20',
    departamento: 'Cesar',
    c_digo_dane_del_municipio: '20.787',
    municipio: 'Tamalameque',
    cName: 'Tamalameque',
    ctId: '20.787'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.001',
    municipio: 'Monteria',
    cName: 'Monteria',
    ctId: '23.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.068',
    municipio: 'Ayapel',
    cName: 'Ayapel',
    ctId: '23.068'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.079',
    municipio: 'Buenavista',
    cName: 'Buenavista',
    ctId: '23.079'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.090',
    municipio: 'Canalete',
    cName: 'Canalete',
    ctId: '23.090'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.162',
    municipio: 'Cerete',
    cName: 'Cerete',
    ctId: '23.162'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.168',
    municipio: 'Chima',
    cName: 'Chima',
    ctId: '23.168'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.182',
    municipio: 'Chinu',
    cName: 'Chinu',
    ctId: '23.182'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.189',
    municipio: 'Cienaga De Oro',
    cName: 'Cienaga De Oro',
    ctId: '23.189'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.300',
    municipio: 'Cotorra',
    cName: 'Cotorra',
    ctId: '23.300'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.350',
    municipio: 'La Apartada',
    cName: 'La Apartada',
    ctId: '23.350'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.417',
    municipio: 'Lorica',
    cName: 'Lorica',
    ctId: '23.417'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.419',
    municipio: 'Los Cordobas',
    cName: 'Los Cordobas',
    ctId: '23.419'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.464',
    municipio: 'Momil',
    cName: 'Momil',
    ctId: '23.464'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.466',
    municipio: 'Montelibano',
    cName: 'Montelibano',
    ctId: '23.466'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.500',
    municipio: 'Moñitos',
    cName: 'Moñitos',
    ctId: '23.500'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.555',
    municipio: 'Planeta Rica',
    cName: 'Planeta Rica',
    ctId: '23.555'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.570',
    municipio: 'Pueblo Nuevo',
    cName: 'Pueblo Nuevo',
    ctId: '23.570'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.574',
    municipio: 'Puerto Escondido',
    cName: 'Puerto Escondido',
    ctId: '23.574'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.580',
    municipio: 'Puerto Libertador',
    cName: 'Puerto Libertador',
    ctId: '23.580'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.586',
    municipio: 'Purisima',
    cName: 'Purisima',
    ctId: '23.586'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.660',
    municipio: 'Sahagun',
    cName: 'Sahagun',
    ctId: '23.660'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.670',
    municipio: 'San Andres Sotavento',
    cName: 'San Andres Sotavento',
    ctId: '23.670'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.672',
    municipio: 'San Antero',
    cName: 'San Antero',
    ctId: '23.672'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.675',
    municipio: 'San Bernardo Del\nviento',
    cName: 'San Bernardo Del\nviento',
    ctId: '23.675'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.678',
    municipio: 'San Carlos',
    cName: 'San Carlos',
    ctId: '23.678'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.686',
    municipio: 'San Pelayo',
    cName: 'San Pelayo',
    ctId: '23.686'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.807',
    municipio: 'Tierralta',
    cName: 'Tierralta',
    ctId: '23.807'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '23',
    departamento: 'Cordova',
    c_digo_dane_del_municipio: '23.855',
    municipio: 'Valencia',
    cName: 'Valencia',
    ctId: '23.855'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.001',
    municipio: 'Agua De Dios',
    cName: 'Agua De Dios',
    ctId: '25.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.019',
    municipio: 'Alban',
    cName: 'Alban',
    ctId: '25.019'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.035',
    municipio: 'Anapoima',
    cName: 'Anapoima',
    ctId: '25.035'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.040',
    municipio: 'Anolaima',
    cName: 'Anolaima',
    ctId: '25.040'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.053',
    municipio: 'Arbelaez',
    cName: 'Arbelaez',
    ctId: '25.053'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.086',
    municipio: 'Beltran',
    cName: 'Beltran',
    ctId: '25.086'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.095',
    municipio: 'Bituima',
    cName: 'Bituima',
    ctId: '25.095'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.099',
    municipio: 'Bojaca',
    cName: 'Bojaca',
    ctId: '25.099'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.120',
    municipio: 'Cabrera',
    cName: 'Cabrera',
    ctId: '25.120'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.123',
    municipio: 'Cachipay',
    cName: 'Cachipay',
    ctId: '25.123'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.126',
    municipio: 'Cajica',
    cName: 'Cajica',
    ctId: '25.126'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.148',
    municipio: 'Caparrapi',
    cName: 'Caparrapi',
    ctId: '25.148'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.151',
    municipio: 'Caqueza',
    cName: 'Caqueza',
    ctId: '25.151'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.154',
    municipio: 'Carmen De Carupa',
    cName: 'Carmen De Carupa',
    ctId: '25.154'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.168',
    municipio: 'Chaguani',
    cName: 'Chaguani',
    ctId: '25.168'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.175',
    municipio: 'Chia',
    cName: 'Chia',
    ctId: '25.175'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.178',
    municipio: 'Chipaque',
    cName: 'Chipaque',
    ctId: '25.178'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.181',
    municipio: 'Choachi',
    cName: 'Choachi',
    ctId: '25.181'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.183',
    municipio: 'Choconta',
    cName: 'Choconta',
    ctId: '25.183'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.200',
    municipio: 'Cogua',
    cName: 'Cogua',
    ctId: '25.200'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.214',
    municipio: 'Cota',
    cName: 'Cota',
    ctId: '25.214'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.224',
    municipio: 'Cucunuba',
    cName: 'Cucunuba',
    ctId: '25.224'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.245',
    municipio: 'El Colegio',
    cName: 'El Colegio',
    ctId: '25.245'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.258',
    municipio: 'El Peñon',
    cName: 'El Peñon',
    ctId: '25.258'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.260',
    municipio: 'El Rosal',
    cName: 'El Rosal',
    ctId: '25.260'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.269',
    municipio: 'Facatativa',
    cName: 'Facatativa',
    ctId: '25.269'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.279',
    municipio: 'Fomeque',
    cName: 'Fomeque',
    ctId: '25.279'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.281',
    municipio: 'Fosca',
    cName: 'Fosca',
    ctId: '25.281'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.286',
    municipio: 'Funza',
    cName: 'Funza',
    ctId: '25.286'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.288',
    municipio: 'Fuquene',
    cName: 'Fuquene',
    ctId: '25.288'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.290',
    municipio: 'Fusagasuga',
    cName: 'Fusagasuga',
    ctId: '25.290'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.293',
    municipio: 'Gachala',
    cName: 'Gachala',
    ctId: '25.293'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.295',
    municipio: 'Gachancipa',
    cName: 'Gachancipa',
    ctId: '25.295'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.297',
    municipio: 'Gacheta',
    cName: 'Gacheta',
    ctId: '25.297'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.299',
    municipio: 'Gama',
    cName: 'Gama',
    ctId: '25.299'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.307',
    municipio: 'Girardot',
    cName: 'Girardot',
    ctId: '25.307'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.312',
    municipio: 'Granada',
    cName: 'Granada',
    ctId: '25.312'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.317',
    municipio: 'Guacheta',
    cName: 'Guacheta',
    ctId: '25.317'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.320',
    municipio: 'Guaduas',
    cName: 'Guaduas',
    ctId: '25.320'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.322',
    municipio: 'Guasca',
    cName: 'Guasca',
    ctId: '25.322'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.324',
    municipio: 'Guataqui',
    cName: 'Guataqui',
    ctId: '25.324'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.326',
    municipio: 'Guatavita',
    cName: 'Guatavita',
    ctId: '25.326'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.328',
    municipio: 'Guayabal De Siquima',
    cName: 'Guayabal De Siquima',
    ctId: '25.328'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.335',
    municipio: 'Guayabetal',
    cName: 'Guayabetal',
    ctId: '25.335'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.339',
    municipio: 'Gutierrez',
    cName: 'Gutierrez',
    ctId: '25.339'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.368',
    municipio: 'Jerusalen',
    cName: 'Jerusalen',
    ctId: '25.368'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.372',
    municipio: 'Junin',
    cName: 'Junin',
    ctId: '25.372'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.377',
    municipio: 'La Calera',
    cName: 'La Calera',
    ctId: '25.377'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.386',
    municipio: 'La Mesa',
    cName: 'La Mesa',
    ctId: '25.386'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.394',
    municipio: 'La Palma',
    cName: 'La Palma',
    ctId: '25.394'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.398',
    municipio: 'La Peña',
    cName: 'La Peña',
    ctId: '25.398'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.402',
    municipio: 'La Vega',
    cName: 'La Vega',
    ctId: '25.402'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.407',
    municipio: 'Lenguazaque',
    cName: 'Lenguazaque',
    ctId: '25.407'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.426',
    municipio: 'Macheta',
    cName: 'Macheta',
    ctId: '25.426'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.430',
    municipio: 'Madrid',
    cName: 'Madrid',
    ctId: '25.430'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.436',
    municipio: 'Manta',
    cName: 'Manta',
    ctId: '25.436'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.438',
    municipio: 'Medina',
    cName: 'Medina',
    ctId: '25.438'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.473',
    municipio: 'Mosquera',
    cName: 'Mosquera',
    ctId: '25.473'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.483',
    municipio: 'Nariño',
    cName: 'Nariño',
    ctId: '25.483'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.486',
    municipio: 'Nemocon',
    cName: 'Nemocon',
    ctId: '25.486'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.488',
    municipio: 'Nilo',
    cName: 'Nilo',
    ctId: '25.488'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.489',
    municipio: 'Nimaima',
    cName: 'Nimaima',
    ctId: '25.489'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.491',
    municipio: 'Nocaima',
    cName: 'Nocaima',
    ctId: '25.491'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.506',
    municipio: 'Venecia (ospina Perez)',
    cName: 'Venecia (ospina Perez)',
    ctId: '25.506'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.513',
    municipio: 'Pacho',
    cName: 'Pacho',
    ctId: '25.513'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.518',
    municipio: 'Paime',
    cName: 'Paime',
    ctId: '25.518'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.524',
    municipio: 'Pandi',
    cName: 'Pandi',
    ctId: '25.524'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.530',
    municipio: 'Paratebueno',
    cName: 'Paratebueno',
    ctId: '25.530'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.535',
    municipio: 'Pasca',
    cName: 'Pasca',
    ctId: '25.535'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.572',
    municipio: 'Puerto Salgar',
    cName: 'Puerto Salgar',
    ctId: '25.572'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.580',
    municipio: 'Puli',
    cName: 'Puli',
    ctId: '25.580'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.592',
    municipio: 'Quebradanegra',
    cName: 'Quebradanegra',
    ctId: '25.592'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.594',
    municipio: 'Quetame',
    cName: 'Quetame',
    ctId: '25.594'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.596',
    municipio: 'Quipile',
    cName: 'Quipile',
    ctId: '25.596'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.599',
    municipio: 'Apulo (rafael Reyes)',
    cName: 'Apulo (rafael Reyes)',
    ctId: '25.599'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.612',
    municipio: 'Ricaurte',
    cName: 'Ricaurte',
    ctId: '25.612'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.645',
    municipio: 'San  Antonio Del\ntequendama',
    cName: 'San  Antonio Del\ntequendama',
    ctId: '25.645'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.649',
    municipio: 'San Bernardo',
    cName: 'San Bernardo',
    ctId: '25.649'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.653',
    municipio: 'San Cayetano',
    cName: 'San Cayetano',
    ctId: '25.653'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.658',
    municipio: 'San Francisco',
    cName: 'San Francisco',
    ctId: '25.658'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.662',
    municipio: 'San Juan De Rioseco',
    cName: 'San Juan De Rioseco',
    ctId: '25.662'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.718',
    municipio: 'Sasaima',
    cName: 'Sasaima',
    ctId: '25.718'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.736',
    municipio: 'Sesquile',
    cName: 'Sesquile',
    ctId: '25.736'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.740',
    municipio: 'Sibate',
    cName: 'Sibate',
    ctId: '25.740'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.743',
    municipio: 'Silvania',
    cName: 'Silvania',
    ctId: '25.743'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.745',
    municipio: 'Simijaca',
    cName: 'Simijaca',
    ctId: '25.745'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.754',
    municipio: 'Soacha',
    cName: 'Soacha',
    ctId: '25.754'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.758',
    municipio: 'Sopo',
    cName: 'Sopo',
    ctId: '25.758'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.769',
    municipio: 'Subachoque',
    cName: 'Subachoque',
    ctId: '25.769'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.772',
    municipio: 'Suesca',
    cName: 'Suesca',
    ctId: '25.772'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.777',
    municipio: 'Supata',
    cName: 'Supata',
    ctId: '25.777'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.779',
    municipio: 'Susa',
    cName: 'Susa',
    ctId: '25.779'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.781',
    municipio: 'Sutatausa',
    cName: 'Sutatausa',
    ctId: '25.781'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.785',
    municipio: 'Tabio',
    cName: 'Tabio',
    ctId: '25.785'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.793',
    municipio: 'Tausa',
    cName: 'Tausa',
    ctId: '25.793'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.797',
    municipio: 'Tena',
    cName: 'Tena',
    ctId: '25.797'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.799',
    municipio: 'Tenjo',
    cName: 'Tenjo',
    ctId: '25.799'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.805',
    municipio: 'Tibacuy',
    cName: 'Tibacuy',
    ctId: '25.805'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.807',
    municipio: 'Tibirita',
    cName: 'Tibirita',
    ctId: '25.807'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.815',
    municipio: 'Tocaima',
    cName: 'Tocaima',
    ctId: '25.815'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.817',
    municipio: 'Tocancipa',
    cName: 'Tocancipa',
    ctId: '25.817'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.823',
    municipio: 'Topaipi',
    cName: 'Topaipi',
    ctId: '25.823'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.839',
    municipio: 'Ubala',
    cName: 'Ubala',
    ctId: '25.839'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.841',
    municipio: 'Ubaque',
    cName: 'Ubaque',
    ctId: '25.841'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.843',
    municipio: 'Ubate',
    cName: 'Ubate',
    ctId: '25.843'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.845',
    municipio: 'Une',
    cName: 'Une',
    ctId: '25.845'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.851',
    municipio: 'Utica',
    cName: 'Utica',
    ctId: '25.851'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.862',
    municipio: 'Vergara',
    cName: 'Vergara',
    ctId: '25.862'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.867',
    municipio: 'Viani',
    cName: 'Viani',
    ctId: '25.867'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.871',
    municipio: 'Villagomez',
    cName: 'Villagomez',
    ctId: '25.871'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.873',
    municipio: 'Villapinzon',
    cName: 'Villapinzon',
    ctId: '25.873'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.875',
    municipio: 'Villeta',
    cName: 'Villeta',
    ctId: '25.875'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.878',
    municipio: 'Viota',
    cName: 'Viota',
    ctId: '25.878'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.885',
    municipio: 'Yacopi',
    cName: 'Yacopi',
    ctId: '25.885'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.898',
    municipio: 'Zipacon',
    cName: 'Zipacon',
    ctId: '25.898'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '25',
    departamento: 'Cundinamarca',
    c_digo_dane_del_municipio: '25.899',
    municipio: 'Zipaquira',
    cName: 'Zipaquira',
    ctId: '25.899'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.001',
    municipio: 'Quibdo (san Francisco\nde Quibdo)',
    cName: 'Quibdo (san Francisco\nde Quibdo)',
    ctId: '27.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.006',
    municipio: 'Acandi',
    cName: 'Acandi',
    ctId: '27.006'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.025',
    municipio: 'Alto Baudo (pie De Pato)',
    cName: 'Alto Baudo (pie De Pato)',
    ctId: '27.025'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.050',
    municipio: 'Atrato',
    cName: 'Atrato',
    ctId: '27.050'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.073',
    municipio: 'Bagado',
    cName: 'Bagado',
    ctId: '27.073'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.075',
    municipio: 'Bahia Solano (mutis)',
    cName: 'Bahia Solano (mutis)',
    ctId: '27.075'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.077',
    municipio: 'Bajo Baudo (pizarro)',
    cName: 'Bajo Baudo (pizarro)',
    ctId: '27.077'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.099',
    municipio: 'Bojaya (bellavista)',
    cName: 'Bojaya (bellavista)',
    ctId: '27.099'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.135',
    municipio: 'Canton De San Pablo\n(managru)',
    cName: 'Canton De San Pablo\n(managru)',
    ctId: '27.135'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.205',
    municipio: 'Condoto',
    cName: 'Condoto',
    ctId: '27.205'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.245',
    municipio: 'El Carmen De Atrato',
    cName: 'El Carmen De Atrato',
    ctId: '27.245'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.250',
    municipio: 'Litoral Del Bajo San Juan (santa Genoveva De\ndocordo)',
    cName: 'Litoral Del Bajo San Juan (santa Genoveva De\ndocordo)',
    ctId: '27.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.361',
    municipio: 'Istmina',
    cName: 'Istmina',
    ctId: '27.361'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.372',
    municipio: 'Jurado',
    cName: 'Jurado',
    ctId: '27.372'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.413',
    municipio: 'Lloro',
    cName: 'Lloro',
    ctId: '27.413'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.425',
    municipio: 'Medio Atrato',
    cName: 'Medio Atrato',
    ctId: '27.425'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.430',
    municipio: 'Medio Baudo',
    cName: 'Medio Baudo',
    ctId: '27.430'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.491',
    municipio: 'Novita',
    cName: 'Novita',
    ctId: '27.491'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.495',
    municipio: 'Nuqui',
    cName: 'Nuqui',
    ctId: '27.495'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.600',
    municipio: 'Rioquito',
    cName: 'Rioquito',
    ctId: '27.600'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.615',
    municipio: 'Riosucio',
    cName: 'Riosucio',
    ctId: '27.615'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.660',
    municipio: 'San Jose Del Palmar',
    cName: 'San Jose Del Palmar',
    ctId: '27.660'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.745',
    municipio: 'Sipi',
    cName: 'Sipi',
    ctId: '27.745'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.787',
    municipio: 'Tado',
    cName: 'Tado',
    ctId: '27.787'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.800',
    municipio: 'Unguia',
    cName: 'Unguia',
    ctId: '27.800'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '27',
    departamento: 'Choco',
    c_digo_dane_del_municipio: '27.810',
    municipio: 'Union Panamericana',
    cName: 'Union Panamericana',
    ctId: '27.810'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.001',
    municipio: 'Neiva',
    cName: 'Neiva',
    ctId: '41.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.006',
    municipio: 'Acevedo',
    cName: 'Acevedo',
    ctId: '41.006'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.013',
    municipio: 'Agrado',
    cName: 'Agrado',
    ctId: '41.013'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.016',
    municipio: 'Aipe',
    cName: 'Aipe',
    ctId: '41.016'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.020',
    municipio: 'Algeciras',
    cName: 'Algeciras',
    ctId: '41.020'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.026',
    municipio: 'Altamira',
    cName: 'Altamira',
    ctId: '41.026'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.078',
    municipio: 'Baraya',
    cName: 'Baraya',
    ctId: '41.078'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.132',
    municipio: 'Campoalegre',
    cName: 'Campoalegre',
    ctId: '41.132'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.206',
    municipio: 'Colombia',
    cName: 'Colombia',
    ctId: '41.206'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.244',
    municipio: 'Elias',
    cName: 'Elias',
    ctId: '41.244'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.298',
    municipio: 'Garzon',
    cName: 'Garzon',
    ctId: '41.298'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.306',
    municipio: 'Gigante',
    cName: 'Gigante',
    ctId: '41.306'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.319',
    municipio: 'Guadalupe',
    cName: 'Guadalupe',
    ctId: '41.319'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.349',
    municipio: 'Hobo',
    cName: 'Hobo',
    ctId: '41.349'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.357',
    municipio: 'Iquira',
    cName: 'Iquira',
    ctId: '41.357'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.359',
    municipio: 'Isnos (san Jose De Isnos)',
    cName: 'Isnos (san Jose De Isnos)',
    ctId: '41.359'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.378',
    municipio: 'La Argentina',
    cName: 'La Argentina',
    ctId: '41.378'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.396',
    municipio: 'La Plata',
    cName: 'La Plata',
    ctId: '41.396'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.483',
    municipio: 'Nataga',
    cName: 'Nataga',
    ctId: '41.483'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.503',
    municipio: 'Oporapa',
    cName: 'Oporapa',
    ctId: '41.503'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.518',
    municipio: 'Paicol',
    cName: 'Paicol',
    ctId: '41.518'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.524',
    municipio: 'Palermo',
    cName: 'Palermo',
    ctId: '41.524'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.530',
    municipio: 'Palestina',
    cName: 'Palestina',
    ctId: '41.530'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.548',
    municipio: 'Pital',
    cName: 'Pital',
    ctId: '41.548'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.551',
    municipio: 'Pitalito',
    cName: 'Pitalito',
    ctId: '41.551'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.615',
    municipio: 'Rivera',
    cName: 'Rivera',
    ctId: '41.615'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.660',
    municipio: 'Saladoblanco',
    cName: 'Saladoblanco',
    ctId: '41.660'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.668',
    municipio: 'San Agustin',
    cName: 'San Agustin',
    ctId: '41.668'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.676',
    municipio: 'Santa Maria',
    cName: 'Santa Maria',
    ctId: '41.676'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.770',
    municipio: 'Suaza',
    cName: 'Suaza',
    ctId: '41.770'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.791',
    municipio: 'Tarqui',
    cName: 'Tarqui',
    ctId: '41.791'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.797',
    municipio: 'Tesalia',
    cName: 'Tesalia',
    ctId: '41.797'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.799',
    municipio: 'Tello',
    cName: 'Tello',
    ctId: '41.799'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.801',
    municipio: 'Teruel',
    cName: 'Teruel',
    ctId: '41.801'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.807',
    municipio: 'Timana',
    cName: 'Timana',
    ctId: '41.807'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.872',
    municipio: 'Villavieja',
    cName: 'Villavieja',
    ctId: '41.872'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '41',
    departamento: 'Huila',
    c_digo_dane_del_municipio: '41.885',
    municipio: 'Yaguara',
    cName: 'Yaguara',
    ctId: '41.885'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.001',
    municipio: 'Riohacha',
    cName: 'Riohacha',
    ctId: '44.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.078',
    municipio: 'Barrancas',
    cName: 'Barrancas',
    ctId: '44.078'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.090',
    municipio: 'Dibulla',
    cName: 'Dibulla',
    ctId: '44.090'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.098',
    municipio: 'Distraccion',
    cName: 'Distraccion',
    ctId: '44.098'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.110',
    municipio: 'El Molino',
    cName: 'El Molino',
    ctId: '44.110'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.279',
    municipio: 'Fonseca',
    cName: 'Fonseca',
    ctId: '44.279'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.378',
    municipio: 'Hatonuevo',
    cName: 'Hatonuevo',
    ctId: '44.378'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.420',
    municipio: 'La Jagua Del Pilar',
    cName: 'La Jagua Del Pilar',
    ctId: '44.420'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.430',
    municipio: 'Maicao',
    cName: 'Maicao',
    ctId: '44.430'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.560',
    municipio: 'Manaure',
    cName: 'Manaure',
    ctId: '44.560'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.650',
    municipio: 'San Juan Del Cesar',
    cName: 'San Juan Del Cesar',
    ctId: '44.650'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.847',
    municipio: 'Uribia',
    cName: 'Uribia',
    ctId: '44.847'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.855',
    municipio: 'Urumita',
    cName: 'Urumita',
    ctId: '44.855'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '44',
    departamento: 'La Guajira',
    c_digo_dane_del_municipio: '44.874',
    municipio: 'Villanueva',
    cName: 'Villanueva',
    ctId: '44.874'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.001',
    municipio: 'Santa Marta (distrito Turistico, Cultural E Historicode Santa\nmarta)',
    cName: 'Santa Marta (distrito Turistico, Cultural E Historicode Santa\nmarta)',
    ctId: '47.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.030',
    municipio: 'Algarrobo',
    cName: 'Algarrobo',
    ctId: '47.030'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.053',
    municipio: 'Aracataca',
    cName: 'Aracataca',
    ctId: '47.053'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.058',
    municipio: 'Ariguani (el Dificil)',
    cName: 'Ariguani (el Dificil)',
    ctId: '47.058'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.161',
    municipio: 'Cerro San Antonio',
    cName: 'Cerro San Antonio',
    ctId: '47.161'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.170',
    municipio: 'Chivolo',
    cName: 'Chivolo',
    ctId: '47.170'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.189',
    municipio: 'Cienaga',
    cName: 'Cienaga',
    ctId: '47.189'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.205',
    municipio: 'Concordia',
    cName: 'Concordia',
    ctId: '47.205'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.245',
    municipio: 'El Banco',
    cName: 'El Banco',
    ctId: '47.245'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.258',
    municipio: 'El Piñon',
    cName: 'El Piñon',
    ctId: '47.258'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.268',
    municipio: 'El Reten',
    cName: 'El Reten',
    ctId: '47.268'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.288',
    municipio: 'Fundacion',
    cName: 'Fundacion',
    ctId: '47.288'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.318',
    municipio: 'Guamal',
    cName: 'Guamal',
    ctId: '47.318'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.541',
    municipio: 'Pedraza',
    cName: 'Pedraza',
    ctId: '47.541'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.545',
    municipio: 'Pijiño Del Carmen\n(pijiño)',
    cName: 'Pijiño Del Carmen\n(pijiño)',
    ctId: '47.545'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.551',
    municipio: 'Pivijay',
    cName: 'Pivijay',
    ctId: '47.551'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.555',
    municipio: 'Plato',
    cName: 'Plato',
    ctId: '47.555'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.570',
    municipio: 'Puebloviejo',
    cName: 'Puebloviejo',
    ctId: '47.570'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.605',
    municipio: 'Remolino',
    cName: 'Remolino',
    ctId: '47.605'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.660',
    municipio: 'Sabanas De San Angel',
    cName: 'Sabanas De San Angel',
    ctId: '47.660'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.675',
    municipio: 'Salamina',
    cName: 'Salamina',
    ctId: '47.675'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.692',
    municipio: 'San Sebastian De\nbuenavista',
    cName: 'San Sebastian De\nbuenavista',
    ctId: '47.692'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.703',
    municipio: 'San Zenon',
    cName: 'San Zenon',
    ctId: '47.703'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.707',
    municipio: 'Santa Ana',
    cName: 'Santa Ana',
    ctId: '47.707'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.745',
    municipio: 'Sitionuevo',
    cName: 'Sitionuevo',
    ctId: '47.745'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '47',
    departamento: 'Magdalena',
    c_digo_dane_del_municipio: '47.798',
    municipio: 'Tenerife',
    cName: 'Tenerife',
    ctId: '47.798'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.001',
    municipio: 'Villavicencio',
    cName: 'Villavicencio',
    ctId: '50.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.006',
    municipio: 'Acacias',
    cName: 'Acacias',
    ctId: '50.006'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.110',
    municipio: 'Barranca De Upia',
    cName: 'Barranca De Upia',
    ctId: '50.110'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.124',
    municipio: 'Cabuyaro',
    cName: 'Cabuyaro',
    ctId: '50.124'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.150',
    municipio: 'Castilla La Nueva',
    cName: 'Castilla La Nueva',
    ctId: '50.150'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.223',
    municipio: 'San Luis De Cubarral',
    cName: 'San Luis De Cubarral',
    ctId: '50.223'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.226',
    municipio: 'Cumaral',
    cName: 'Cumaral',
    ctId: '50.226'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.245',
    municipio: 'El Calvario',
    cName: 'El Calvario',
    ctId: '50.245'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.251',
    municipio: 'El Castillo',
    cName: 'El Castillo',
    ctId: '50.251'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.270',
    municipio: 'El Dorado',
    cName: 'El Dorado',
    ctId: '50.270'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.287',
    municipio: 'Fuente De Oro',
    cName: 'Fuente De Oro',
    ctId: '50.287'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.313',
    municipio: 'Granada',
    cName: 'Granada',
    ctId: '50.313'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.318',
    municipio: 'Guamal',
    cName: 'Guamal',
    ctId: '50.318'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.325',
    municipio: 'Mapiripan',
    cName: 'Mapiripan',
    ctId: '50.325'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.330',
    municipio: 'Mesetas',
    cName: 'Mesetas',
    ctId: '50.330'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.350',
    municipio: 'La Macarena',
    cName: 'La Macarena',
    ctId: '50.350'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.370',
    municipio: 'La Uribe',
    cName: 'La Uribe',
    ctId: '50.370'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.400',
    municipio: 'Lejanias',
    cName: 'Lejanias',
    ctId: '50.400'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.450',
    municipio: 'Puerto Concordia',
    cName: 'Puerto Concordia',
    ctId: '50.450'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.568',
    municipio: 'Puerto Gaitan',
    cName: 'Puerto Gaitan',
    ctId: '50.568'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.573',
    municipio: 'Puerto Lopez',
    cName: 'Puerto Lopez',
    ctId: '50.573'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.577',
    municipio: 'Puerto Lleras',
    cName: 'Puerto Lleras',
    ctId: '50.577'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.590',
    municipio: 'Puerto Rico',
    cName: 'Puerto Rico',
    ctId: '50.590'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.606',
    municipio: 'Restrepo',
    cName: 'Restrepo',
    ctId: '50.606'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.680',
    municipio: 'San Carlos De Guaroa',
    cName: 'San Carlos De Guaroa',
    ctId: '50.680'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.683',
    municipio: 'San  Juan De Arama',
    cName: 'San  Juan De Arama',
    ctId: '50.683'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.686',
    municipio: 'San Juanito',
    cName: 'San Juanito',
    ctId: '50.686'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.689',
    municipio: 'San Martin',
    cName: 'San Martin',
    ctId: '50.689'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '50',
    departamento: 'Meta',
    c_digo_dane_del_municipio: '50.711',
    municipio: 'Vistahermosa',
    cName: 'Vistahermosa',
    ctId: '50.711'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.001',
    municipio: 'Pasto (san Juan De\npasto)',
    cName: 'Pasto (san Juan De\npasto)',
    ctId: '52.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.019',
    municipio: 'Alban (san Jose)',
    cName: 'Alban (san Jose)',
    ctId: '52.019'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.022',
    municipio: 'Aldana',
    cName: 'Aldana',
    ctId: '52.022'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.036',
    municipio: 'Ancuya',
    cName: 'Ancuya',
    ctId: '52.036'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.051',
    municipio: 'Arboleda (berruecos)',
    cName: 'Arboleda (berruecos)',
    ctId: '52.051'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.079',
    municipio: 'Barbacoas',
    cName: 'Barbacoas',
    ctId: '52.079'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.083',
    municipio: 'Belen',
    cName: 'Belen',
    ctId: '52.083'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.110',
    municipio: 'Buesaco',
    cName: 'Buesaco',
    ctId: '52.110'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.203',
    municipio: 'Colon (genova)',
    cName: 'Colon (genova)',
    ctId: '52.203'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.207',
    municipio: 'Consaca',
    cName: 'Consaca',
    ctId: '52.207'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.210',
    municipio: 'Contadero',
    cName: 'Contadero',
    ctId: '52.210'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.215',
    municipio: 'Cordoba',
    cName: 'Cordoba',
    ctId: '52.215'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.224',
    municipio: 'Cuaspud (carlosama)',
    cName: 'Cuaspud (carlosama)',
    ctId: '52.224'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.227',
    municipio: 'Cumbal',
    cName: 'Cumbal',
    ctId: '52.227'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.233',
    municipio: 'Cumbitara',
    cName: 'Cumbitara',
    ctId: '52.233'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.240',
    municipio: 'Chachagui',
    cName: 'Chachagui',
    ctId: '52.240'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.250',
    municipio: 'El Charco',
    cName: 'El Charco',
    ctId: '52.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.254',
    municipio: 'El Peñol',
    cName: 'El Peñol',
    ctId: '52.254'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.256',
    municipio: 'El Rosario',
    cName: 'El Rosario',
    ctId: '52.256'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.258',
    municipio: 'El Tablon',
    cName: 'El Tablon',
    ctId: '52.258'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.260',
    municipio: 'El Tambo',
    cName: 'El Tambo',
    ctId: '52.260'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.287',
    municipio: 'Funes',
    cName: 'Funes',
    ctId: '52.287'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.317',
    municipio: 'Guachucal',
    cName: 'Guachucal',
    ctId: '52.317'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.320',
    municipio: 'Guaitarilla',
    cName: 'Guaitarilla',
    ctId: '52.320'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.323',
    municipio: 'Gualmatan',
    cName: 'Gualmatan',
    ctId: '52.323'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.352',
    municipio: 'Iles',
    cName: 'Iles',
    ctId: '52.352'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.354',
    municipio: 'Imues',
    cName: 'Imues',
    ctId: '52.354'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.356',
    municipio: 'Ipiales',
    cName: 'Ipiales',
    ctId: '52.356'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.378',
    municipio: 'La Cruz',
    cName: 'La Cruz',
    ctId: '52.378'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.381',
    municipio: 'La Florida',
    cName: 'La Florida',
    ctId: '52.381'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.385',
    municipio: 'La Llanada',
    cName: 'La Llanada',
    ctId: '52.385'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.390',
    municipio: 'La Tola',
    cName: 'La Tola',
    ctId: '52.390'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.399',
    municipio: 'La Union',
    cName: 'La Union',
    ctId: '52.399'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.405',
    municipio: 'Leiva',
    cName: 'Leiva',
    ctId: '52.405'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.411',
    municipio: 'Linares',
    cName: 'Linares',
    ctId: '52.411'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.418',
    municipio: 'Los Andes (sotomayor)',
    cName: 'Los Andes (sotomayor)',
    ctId: '52.418'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.427',
    municipio: 'Magui (payan)',
    cName: 'Magui (payan)',
    ctId: '52.427'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.435',
    municipio: 'Mallama (piedrancha)',
    cName: 'Mallama (piedrancha)',
    ctId: '52.435'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.473',
    municipio: 'Mosquera',
    cName: 'Mosquera',
    ctId: '52.473'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.490',
    municipio: 'Olaya Herrera (bocas\nde Satinga)',
    cName: 'Olaya Herrera (bocas\nde Satinga)',
    ctId: '52.490'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.506',
    municipio: 'Ospina',
    cName: 'Ospina',
    ctId: '52.506'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.520',
    municipio: 'Francisco Pizarro\n(salahonda)',
    cName: 'Francisco Pizarro\n(salahonda)',
    ctId: '52.520'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.540',
    municipio: 'Policarpa',
    cName: 'Policarpa',
    ctId: '52.540'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.560',
    municipio: 'Potosi',
    cName: 'Potosi',
    ctId: '52.560'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.565',
    municipio: 'Providencia',
    cName: 'Providencia',
    ctId: '52.565'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.573',
    municipio: 'Puerres',
    cName: 'Puerres',
    ctId: '52.573'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.585',
    municipio: 'Pupiales',
    cName: 'Pupiales',
    ctId: '52.585'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.612',
    municipio: 'Ricaurte',
    cName: 'Ricaurte',
    ctId: '52.612'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.621',
    municipio: 'Roberto Payan (san\njose)',
    cName: 'Roberto Payan (san\njose)',
    ctId: '52.621'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.678',
    municipio: 'Samaniego',
    cName: 'Samaniego',
    ctId: '52.678'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.683',
    municipio: 'Sandona',
    cName: 'Sandona',
    ctId: '52.683'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.685',
    municipio: 'San Bernardo',
    cName: 'San Bernardo',
    ctId: '52.685'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.687',
    municipio: 'San Lorenzo',
    cName: 'San Lorenzo',
    ctId: '52.687'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.693',
    municipio: 'San Pablo',
    cName: 'San Pablo',
    ctId: '52.693'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.694',
    municipio: 'San Pedro De Cartago',
    cName: 'San Pedro De Cartago',
    ctId: '52.694'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.696',
    municipio: 'Santa Barbara\n(iscuande)',
    cName: 'Santa Barbara\n(iscuande)',
    ctId: '52.696'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.699',
    municipio: 'Santa Cruz (guachaves)',
    cName: 'Santa Cruz (guachaves)',
    ctId: '52.699'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.720',
    municipio: 'Sapuyes',
    cName: 'Sapuyes',
    ctId: '52.720'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.786',
    municipio: 'Taminango',
    cName: 'Taminango',
    ctId: '52.786'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.788',
    municipio: 'Tangua',
    cName: 'Tangua',
    ctId: '52.788'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.835',
    municipio: 'Tumaco',
    cName: 'Tumaco',
    ctId: '52.835'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.838',
    municipio: 'Tuquerres',
    cName: 'Tuquerres',
    ctId: '52.838'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '52',
    departamento: 'Nariño',
    c_digo_dane_del_municipio: '52.885',
    municipio: 'Yacuanquer',
    cName: 'Yacuanquer',
    ctId: '52.885'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.001',
    municipio: 'Cucuta',
    cName: 'Cucuta',
    ctId: '54.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.003',
    municipio: 'Abrego',
    cName: 'Abrego',
    ctId: '54.003'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.051',
    municipio: 'Arboledas',
    cName: 'Arboledas',
    ctId: '54.051'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.099',
    municipio: 'Bochalema',
    cName: 'Bochalema',
    ctId: '54.099'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.109',
    municipio: 'Bucarasica',
    cName: 'Bucarasica',
    ctId: '54.109'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.125',
    municipio: 'Cacota',
    cName: 'Cacota',
    ctId: '54.125'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.128',
    municipio: 'Cachira',
    cName: 'Cachira',
    ctId: '54.128'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.172',
    municipio: 'Chinacota',
    cName: 'Chinacota',
    ctId: '54.172'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.174',
    municipio: 'Chitaga',
    cName: 'Chitaga',
    ctId: '54.174'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.206',
    municipio: 'Convencion',
    cName: 'Convencion',
    ctId: '54.206'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.223',
    municipio: 'Cucutilla',
    cName: 'Cucutilla',
    ctId: '54.223'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.239',
    municipio: 'Durania',
    cName: 'Durania',
    ctId: '54.239'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.245',
    municipio: 'El Carmen',
    cName: 'El Carmen',
    ctId: '54.245'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.250',
    municipio: 'El Tarra',
    cName: 'El Tarra',
    ctId: '54.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.261',
    municipio: 'El Zulia',
    cName: 'El Zulia',
    ctId: '54.261'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.313',
    municipio: 'Gramalote',
    cName: 'Gramalote',
    ctId: '54.313'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.344',
    municipio: 'Hacari',
    cName: 'Hacari',
    ctId: '54.344'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.347',
    municipio: 'Herran',
    cName: 'Herran',
    ctId: '54.347'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.377',
    municipio: 'Labateca',
    cName: 'Labateca',
    ctId: '54.377'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.385',
    municipio: 'La Esperanza',
    cName: 'La Esperanza',
    ctId: '54.385'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.398',
    municipio: 'La Playa',
    cName: 'La Playa',
    ctId: '54.398'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.405',
    municipio: 'Los Patios',
    cName: 'Los Patios',
    ctId: '54.405'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.418',
    municipio: 'Lourdes',
    cName: 'Lourdes',
    ctId: '54.418'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.480',
    municipio: 'Mutiscua',
    cName: 'Mutiscua',
    ctId: '54.480'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.498',
    municipio: 'Ocaña',
    cName: 'Ocaña',
    ctId: '54.498'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.518',
    municipio: 'Pamplona',
    cName: 'Pamplona',
    ctId: '54.518'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.520',
    municipio: 'Pamplonita',
    cName: 'Pamplonita',
    ctId: '54.520'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.553',
    municipio: 'Puerto Santander',
    cName: 'Puerto Santander',
    ctId: '54.553'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.599',
    municipio: 'Ragonvalia',
    cName: 'Ragonvalia',
    ctId: '54.599'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.660',
    municipio: 'Salazar',
    cName: 'Salazar',
    ctId: '54.660'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.670',
    municipio: 'San Calixto',
    cName: 'San Calixto',
    ctId: '54.670'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.673',
    municipio: 'San Cayetano',
    cName: 'San Cayetano',
    ctId: '54.673'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.680',
    municipio: 'Santiago',
    cName: 'Santiago',
    ctId: '54.680'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.720',
    municipio: 'Sardinata',
    cName: 'Sardinata',
    ctId: '54.720'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.743',
    municipio: 'Silos',
    cName: 'Silos',
    ctId: '54.743'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.800',
    municipio: 'Teorama',
    cName: 'Teorama',
    ctId: '54.800'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.810',
    municipio: 'Tibu',
    cName: 'Tibu',
    ctId: '54.810'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.820',
    municipio: 'Toledo',
    cName: 'Toledo',
    ctId: '54.820'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.871',
    municipio: 'Villacaro',
    cName: 'Villacaro',
    ctId: '54.871'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '54',
    departamento: 'Norte de Santander',
    c_digo_dane_del_municipio: '54.874',
    municipio: 'Villa Del Rosario',
    cName: 'Villa Del Rosario',
    ctId: '54.874'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.001',
    municipio: 'Armenia',
    cName: 'Armenia',
    ctId: '63.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.111',
    municipio: 'Buenavista',
    cName: 'Buenavista',
    ctId: '63.111'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.130',
    municipio: 'Calarca',
    cName: 'Calarca',
    ctId: '63.130'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.190',
    municipio: 'Circasia',
    cName: 'Circasia',
    ctId: '63.190'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.212',
    municipio: 'Cordoba',
    cName: 'Cordoba',
    ctId: '63.212'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.272',
    municipio: 'Filandia',
    cName: 'Filandia',
    ctId: '63.272'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.302',
    municipio: 'Genova',
    cName: 'Genova',
    ctId: '63.302'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.401',
    municipio: 'La Tebaida',
    cName: 'La Tebaida',
    ctId: '63.401'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.470',
    municipio: 'Montenegro',
    cName: 'Montenegro',
    ctId: '63.470'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.548',
    municipio: 'Pijao',
    cName: 'Pijao',
    ctId: '63.548'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.594',
    municipio: 'Quimbaya',
    cName: 'Quimbaya',
    ctId: '63.594'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '63',
    departamento: 'Quindio',
    c_digo_dane_del_municipio: '63.690',
    municipio: 'Salento',
    cName: 'Salento',
    ctId: '63.690'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.001',
    municipio: 'Pereira',
    cName: 'Pereira',
    ctId: '66.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.045',
    municipio: 'Apia',
    cName: 'Apia',
    ctId: '66.045'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.075',
    municipio: 'Balboa',
    cName: 'Balboa',
    ctId: '66.075'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.088',
    municipio: 'Belen De Umbria',
    cName: 'Belen De Umbria',
    ctId: '66.088'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.170',
    municipio: 'Dos Quebradas',
    cName: 'Dos Quebradas',
    ctId: '66.170'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.318',
    municipio: 'Guatica',
    cName: 'Guatica',
    ctId: '66.318'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.383',
    municipio: 'La Celia',
    cName: 'La Celia',
    ctId: '66.383'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.400',
    municipio: 'La Virginia',
    cName: 'La Virginia',
    ctId: '66.400'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.440',
    municipio: 'Marsella',
    cName: 'Marsella',
    ctId: '66.440'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.456',
    municipio: 'Mistrato',
    cName: 'Mistrato',
    ctId: '66.456'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.572',
    municipio: 'Pueblo Rico',
    cName: 'Pueblo Rico',
    ctId: '66.572'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.594',
    municipio: 'Quinchia',
    cName: 'Quinchia',
    ctId: '66.594'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.682',
    municipio: 'Santa Rosa De Cabal',
    cName: 'Santa Rosa De Cabal',
    ctId: '66.682'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '66',
    departamento: 'Risaralda',
    c_digo_dane_del_municipio: '66.687',
    municipio: 'Santuario',
    cName: 'Santuario',
    ctId: '66.687'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.001',
    municipio: 'Bucaramanga',
    cName: 'Bucaramanga',
    ctId: '68.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.013',
    municipio: 'Aguada',
    cName: 'Aguada',
    ctId: '68.013'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.020',
    municipio: 'Albania',
    cName: 'Albania',
    ctId: '68.020'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.051',
    municipio: 'Aratoca',
    cName: 'Aratoca',
    ctId: '68.051'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.077',
    municipio: 'Barbosa',
    cName: 'Barbosa',
    ctId: '68.077'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.079',
    municipio: 'Barichara',
    cName: 'Barichara',
    ctId: '68.079'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.081',
    municipio: 'Barrancabermeja',
    cName: 'Barrancabermeja',
    ctId: '68.081'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.092',
    municipio: 'Betulia',
    cName: 'Betulia',
    ctId: '68.092'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.101',
    municipio: 'Bolivar',
    cName: 'Bolivar',
    ctId: '68.101'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.121',
    municipio: 'Cabrera',
    cName: 'Cabrera',
    ctId: '68.121'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.132',
    municipio: 'California',
    cName: 'California',
    ctId: '68.132'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.147',
    municipio: 'Capitanejo',
    cName: 'Capitanejo',
    ctId: '68.147'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.152',
    municipio: 'Carcasi',
    cName: 'Carcasi',
    ctId: '68.152'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.160',
    municipio: 'Cepita',
    cName: 'Cepita',
    ctId: '68.160'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.162',
    municipio: 'Cerrito',
    cName: 'Cerrito',
    ctId: '68.162'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.167',
    municipio: 'Charala',
    cName: 'Charala',
    ctId: '68.167'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.169',
    municipio: 'Charta',
    cName: 'Charta',
    ctId: '68.169'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.176',
    municipio: 'Chima',
    cName: 'Chima',
    ctId: '68.176'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.179',
    municipio: 'Chipata',
    cName: 'Chipata',
    ctId: '68.179'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.190',
    municipio: 'Cimitarra',
    cName: 'Cimitarra',
    ctId: '68.190'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.207',
    municipio: 'Concepcion',
    cName: 'Concepcion',
    ctId: '68.207'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.209',
    municipio: 'Confines',
    cName: 'Confines',
    ctId: '68.209'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.211',
    municipio: 'Contratacion',
    cName: 'Contratacion',
    ctId: '68.211'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.217',
    municipio: 'Coromoro',
    cName: 'Coromoro',
    ctId: '68.217'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.229',
    municipio: 'Curiti',
    cName: 'Curiti',
    ctId: '68.229'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.235',
    municipio: 'El Carmen De Chucury',
    cName: 'El Carmen De Chucury',
    ctId: '68.235'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.245',
    municipio: 'El Guacamayo',
    cName: 'El Guacamayo',
    ctId: '68.245'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.250',
    municipio: 'El Peñon',
    cName: 'El Peñon',
    ctId: '68.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.255',
    municipio: 'El Playon',
    cName: 'El Playon',
    ctId: '68.255'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.264',
    municipio: 'Encino',
    cName: 'Encino',
    ctId: '68.264'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.266',
    municipio: 'Enciso',
    cName: 'Enciso',
    ctId: '68.266'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.271',
    municipio: 'Florian',
    cName: 'Florian',
    ctId: '68.271'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.276',
    municipio: 'Floridablanca',
    cName: 'Floridablanca',
    ctId: '68.276'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.296',
    municipio: 'Galan',
    cName: 'Galan',
    ctId: '68.296'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.298',
    municipio: 'Gambita',
    cName: 'Gambita',
    ctId: '68.298'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.307',
    municipio: 'Giron',
    cName: 'Giron',
    ctId: '68.307'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.318',
    municipio: 'Guaca',
    cName: 'Guaca',
    ctId: '68.318'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.320',
    municipio: 'Guadalupe',
    cName: 'Guadalupe',
    ctId: '68.320'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.322',
    municipio: 'Guapota',
    cName: 'Guapota',
    ctId: '68.322'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.324',
    municipio: 'Guavata',
    cName: 'Guavata',
    ctId: '68.324'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.327',
    municipio: 'Guepsa',
    cName: 'Guepsa',
    ctId: '68.327'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.344',
    municipio: 'Hato',
    cName: 'Hato',
    ctId: '68.344'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.368',
    municipio: 'Jesus Maria',
    cName: 'Jesus Maria',
    ctId: '68.368'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.370',
    municipio: 'Jordan',
    cName: 'Jordan',
    ctId: '68.370'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.377',
    municipio: 'La Belleza',
    cName: 'La Belleza',
    ctId: '68.377'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.385',
    municipio: 'Landazuri',
    cName: 'Landazuri',
    ctId: '68.385'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.397',
    municipio: 'La Paz',
    cName: 'La Paz',
    ctId: '68.397'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.406',
    municipio: 'Lebrija',
    cName: 'Lebrija',
    ctId: '68.406'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.418',
    municipio: 'Los Santos',
    cName: 'Los Santos',
    ctId: '68.418'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.425',
    municipio: 'Macaravita',
    cName: 'Macaravita',
    ctId: '68.425'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.432',
    municipio: 'Malaga',
    cName: 'Malaga',
    ctId: '68.432'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.444',
    municipio: 'Matanza',
    cName: 'Matanza',
    ctId: '68.444'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.464',
    municipio: 'Mogotes',
    cName: 'Mogotes',
    ctId: '68.464'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.468',
    municipio: 'Molagavita',
    cName: 'Molagavita',
    ctId: '68.468'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.498',
    municipio: 'Ocamonte',
    cName: 'Ocamonte',
    ctId: '68.498'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.500',
    municipio: 'Oiba',
    cName: 'Oiba',
    ctId: '68.500'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.502',
    municipio: 'Onzaga',
    cName: 'Onzaga',
    ctId: '68.502'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.522',
    municipio: 'Palmar',
    cName: 'Palmar',
    ctId: '68.522'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.524',
    municipio: 'Palmas Del Socorro',
    cName: 'Palmas Del Socorro',
    ctId: '68.524'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.533',
    municipio: 'Paramo',
    cName: 'Paramo',
    ctId: '68.533'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.547',
    municipio: 'Piedecuesta',
    cName: 'Piedecuesta',
    ctId: '68.547'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.549',
    municipio: 'Pinchote',
    cName: 'Pinchote',
    ctId: '68.549'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.572',
    municipio: 'Puente Nacional',
    cName: 'Puente Nacional',
    ctId: '68.572'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.573',
    municipio: 'Puerto Parra',
    cName: 'Puerto Parra',
    ctId: '68.573'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.575',
    municipio: 'Puerto Wilches',
    cName: 'Puerto Wilches',
    ctId: '68.575'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.615',
    municipio: 'Rionegro',
    cName: 'Rionegro',
    ctId: '68.615'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.655',
    municipio: 'Sabana De Torres',
    cName: 'Sabana De Torres',
    ctId: '68.655'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.669',
    municipio: 'San Andres',
    cName: 'San Andres',
    ctId: '68.669'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.673',
    municipio: 'San Benito',
    cName: 'San Benito',
    ctId: '68.673'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.679',
    municipio: 'San Gil',
    cName: 'San Gil',
    ctId: '68.679'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.682',
    municipio: 'San Joaquin',
    cName: 'San Joaquin',
    ctId: '68.682'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.684',
    municipio: 'San Jose De Miranda',
    cName: 'San Jose De Miranda',
    ctId: '68.684'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.686',
    municipio: 'San Miguel',
    cName: 'San Miguel',
    ctId: '68.686'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.689',
    municipio: 'San Vicente De Chucuri',
    cName: 'San Vicente De Chucuri',
    ctId: '68.689'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.705',
    municipio: 'Santa Barbara',
    cName: 'Santa Barbara',
    ctId: '68.705'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.720',
    municipio: 'Santa Helena Del Opon',
    cName: 'Santa Helena Del Opon',
    ctId: '68.720'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.745',
    municipio: 'Simacota',
    cName: 'Simacota',
    ctId: '68.745'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.755',
    municipio: 'Socorro',
    cName: 'Socorro',
    ctId: '68.755'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.770',
    municipio: 'Suaita',
    cName: 'Suaita',
    ctId: '68.770'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.773',
    municipio: 'Sucre',
    cName: 'Sucre',
    ctId: '68.773'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.780',
    municipio: 'Surata',
    cName: 'Surata',
    ctId: '68.780'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.820',
    municipio: 'Tona',
    cName: 'Tona',
    ctId: '68.820'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.855',
    municipio: 'Valle San Jose',
    cName: 'Valle San Jose',
    ctId: '68.855'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.861',
    municipio: 'Velez',
    cName: 'Velez',
    ctId: '68.861'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.867',
    municipio: 'Vetas',
    cName: 'Vetas',
    ctId: '68.867'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.872',
    municipio: 'Villanueva',
    cName: 'Villanueva',
    ctId: '68.872'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '68',
    departamento: 'Santander',
    c_digo_dane_del_municipio: '68.895',
    municipio: 'Zapatoca',
    cName: 'Zapatoca',
    ctId: '68.895'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.001',
    municipio: 'Sincelejo',
    cName: 'Sincelejo',
    ctId: '70.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.110',
    municipio: 'Buenavista',
    cName: 'Buenavista',
    ctId: '70.110'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.124',
    municipio: 'Caimito',
    cName: 'Caimito',
    ctId: '70.124'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.204',
    municipio: 'Coloso (ricaurte)',
    cName: 'Coloso (ricaurte)',
    ctId: '70.204'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.215',
    municipio: 'Corozal',
    cName: 'Corozal',
    ctId: '70.215'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.230',
    municipio: 'Chalan',
    cName: 'Chalan',
    ctId: '70.230'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.235',
    municipio: 'Galeras (nueva\ngranada)',
    cName: 'Galeras (nueva\ngranada)',
    ctId: '70.235'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.265',
    municipio: 'Guaranda',
    cName: 'Guaranda',
    ctId: '70.265'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.400',
    municipio: 'La Union',
    cName: 'La Union',
    ctId: '70.400'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.418',
    municipio: 'Los Palmitos',
    cName: 'Los Palmitos',
    ctId: '70.418'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.429',
    municipio: 'Majagual',
    cName: 'Majagual',
    ctId: '70.429'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.473',
    municipio: 'Morroa',
    cName: 'Morroa',
    ctId: '70.473'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.508',
    municipio: 'Ovejas',
    cName: 'Ovejas',
    ctId: '70.508'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.523',
    municipio: 'Palmito',
    cName: 'Palmito',
    ctId: '70.523'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.670',
    municipio: 'Sampues',
    cName: 'Sampues',
    ctId: '70.670'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.678',
    municipio: 'San Benito Abad',
    cName: 'San Benito Abad',
    ctId: '70.678'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.702',
    municipio: 'San Juan De Betulia',
    cName: 'San Juan De Betulia',
    ctId: '70.702'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.708',
    municipio: 'San Marcos',
    cName: 'San Marcos',
    ctId: '70.708'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.713',
    municipio: 'San Onofre',
    cName: 'San Onofre',
    ctId: '70.713'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.717',
    municipio: 'San Pedro',
    cName: 'San Pedro',
    ctId: '70.717'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.742',
    municipio: 'Since',
    cName: 'Since',
    ctId: '70.742'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.771',
    municipio: 'Sucre',
    cName: 'Sucre',
    ctId: '70.771'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.820',
    municipio: 'Tolu',
    cName: 'Tolu',
    ctId: '70.820'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '70',
    departamento: 'Sucre',
    c_digo_dane_del_municipio: '70.823',
    municipio: 'Toluviejo',
    cName: 'Toluviejo',
    ctId: '70.823'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.001',
    municipio: 'Ibague',
    cName: 'Ibague',
    ctId: '73.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.024',
    municipio: 'Alpujarra',
    cName: 'Alpujarra',
    ctId: '73.024'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.026',
    municipio: 'Alvarado',
    cName: 'Alvarado',
    ctId: '73.026'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.030',
    municipio: 'Ambalema',
    cName: 'Ambalema',
    ctId: '73.030'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.043',
    municipio: 'Anzoategui',
    cName: 'Anzoategui',
    ctId: '73.043'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.055',
    municipio: 'Armero (guayabal)',
    cName: 'Armero (guayabal)',
    ctId: '73.055'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.067',
    municipio: 'Ataco',
    cName: 'Ataco',
    ctId: '73.067'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.124',
    municipio: 'Cajamarca',
    cName: 'Cajamarca',
    ctId: '73.124'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.148',
    municipio: 'Carmen Apicala',
    cName: 'Carmen Apicala',
    ctId: '73.148'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.152',
    municipio: 'Casabianca',
    cName: 'Casabianca',
    ctId: '73.152'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.168',
    municipio: 'Chaparral',
    cName: 'Chaparral',
    ctId: '73.168'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.200',
    municipio: 'Coello',
    cName: 'Coello',
    ctId: '73.200'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.217',
    municipio: 'Coyaima',
    cName: 'Coyaima',
    ctId: '73.217'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.226',
    municipio: 'Cunday',
    cName: 'Cunday',
    ctId: '73.226'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.236',
    municipio: 'Dolores',
    cName: 'Dolores',
    ctId: '73.236'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.268',
    municipio: 'Espinal',
    cName: 'Espinal',
    ctId: '73.268'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.270',
    municipio: 'Falan',
    cName: 'Falan',
    ctId: '73.270'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.275',
    municipio: 'Flandes',
    cName: 'Flandes',
    ctId: '73.275'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.283',
    municipio: 'Fresno',
    cName: 'Fresno',
    ctId: '73.283'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.319',
    municipio: 'Guamo',
    cName: 'Guamo',
    ctId: '73.319'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.347',
    municipio: 'Herveo',
    cName: 'Herveo',
    ctId: '73.347'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.349',
    municipio: 'Honda',
    cName: 'Honda',
    ctId: '73.349'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.352',
    municipio: 'Icononzo',
    cName: 'Icononzo',
    ctId: '73.352'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.408',
    municipio: 'Lerida',
    cName: 'Lerida',
    ctId: '73.408'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.411',
    municipio: 'Libano',
    cName: 'Libano',
    ctId: '73.411'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.443',
    municipio: 'Mariquita',
    cName: 'Mariquita',
    ctId: '73.443'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.449',
    municipio: 'Melgar',
    cName: 'Melgar',
    ctId: '73.449'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.461',
    municipio: 'Murillo',
    cName: 'Murillo',
    ctId: '73.461'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.483',
    municipio: 'Natagaima',
    cName: 'Natagaima',
    ctId: '73.483'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.504',
    municipio: 'Ortega',
    cName: 'Ortega',
    ctId: '73.504'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.520',
    municipio: 'Palocabildo',
    cName: 'Palocabildo',
    ctId: '73.520'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.547',
    municipio: 'Piedras',
    cName: 'Piedras',
    ctId: '73.547'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.555',
    municipio: 'Planadas',
    cName: 'Planadas',
    ctId: '73.555'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.563',
    municipio: 'Prado',
    cName: 'Prado',
    ctId: '73.563'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.585',
    municipio: 'Purificacion',
    cName: 'Purificacion',
    ctId: '73.585'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.616',
    municipio: 'Rioblanco',
    cName: 'Rioblanco',
    ctId: '73.616'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.622',
    municipio: 'Roncesvalles',
    cName: 'Roncesvalles',
    ctId: '73.622'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.624',
    municipio: 'Rovira',
    cName: 'Rovira',
    ctId: '73.624'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.671',
    municipio: 'Saldaña',
    cName: 'Saldaña',
    ctId: '73.671'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.675',
    municipio: 'San Antonio',
    cName: 'San Antonio',
    ctId: '73.675'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.678',
    municipio: 'San Luis',
    cName: 'San Luis',
    ctId: '73.678'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.686',
    municipio: 'Santa Isabel',
    cName: 'Santa Isabel',
    ctId: '73.686'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.770',
    municipio: 'Suarez',
    cName: 'Suarez',
    ctId: '73.770'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.854',
    municipio: 'Valle De San Juan',
    cName: 'Valle De San Juan',
    ctId: '73.854'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.861',
    municipio: 'Venadillo',
    cName: 'Venadillo',
    ctId: '73.861'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.870',
    municipio: 'Villahermosa',
    cName: 'Villahermosa',
    ctId: '73.870'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '73',
    departamento: 'Tolima',
    c_digo_dane_del_municipio: '73.873',
    municipio: 'Villarrica',
    cName: 'Villarrica',
    ctId: '73.873'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.001',
    municipio: 'Cali (santiago De Cali)',
    cName: 'Cali (santiago De Cali)',
    ctId: '76.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.020',
    municipio: 'Alcala',
    cName: 'Alcala',
    ctId: '76.020'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.036',
    municipio: 'Andalucia',
    cName: 'Andalucia',
    ctId: '76.036'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.041',
    municipio: 'Ansermanuevo',
    cName: 'Ansermanuevo',
    ctId: '76.041'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.054',
    municipio: 'Argelia',
    cName: 'Argelia',
    ctId: '76.054'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.100',
    municipio: 'Bolivar',
    cName: 'Bolivar',
    ctId: '76.100'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.109',
    municipio: 'Buenaventura',
    cName: 'Buenaventura',
    ctId: '76.109'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.111',
    municipio: 'Buga',
    cName: 'Buga',
    ctId: '76.111'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.113',
    municipio: 'Bugalagrande',
    cName: 'Bugalagrande',
    ctId: '76.113'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.122',
    municipio: 'Caicedonia',
    cName: 'Caicedonia',
    ctId: '76.122'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.126',
    municipio: 'Calima (darien)',
    cName: 'Calima (darien)',
    ctId: '76.126'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.130',
    municipio: 'Candelaria',
    cName: 'Candelaria',
    ctId: '76.130'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.147',
    municipio: 'Cartago',
    cName: 'Cartago',
    ctId: '76.147'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.233',
    municipio: 'Dagua',
    cName: 'Dagua',
    ctId: '76.233'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.243',
    municipio: 'El Aguila',
    cName: 'El Aguila',
    ctId: '76.243'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.246',
    municipio: 'El Cairo',
    cName: 'El Cairo',
    ctId: '76.246'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.248',
    municipio: 'El Cerrito',
    cName: 'El Cerrito',
    ctId: '76.248'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.250',
    municipio: 'El Dovio',
    cName: 'El Dovio',
    ctId: '76.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.275',
    municipio: 'Florida',
    cName: 'Florida',
    ctId: '76.275'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.306',
    municipio: 'Ginebra',
    cName: 'Ginebra',
    ctId: '76.306'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.318',
    municipio: 'Guacari',
    cName: 'Guacari',
    ctId: '76.318'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.364',
    municipio: 'Jamundi',
    cName: 'Jamundi',
    ctId: '76.364'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.377',
    municipio: 'La Cumbre',
    cName: 'La Cumbre',
    ctId: '76.377'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.400',
    municipio: 'La Union',
    cName: 'La Union',
    ctId: '76.400'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.403',
    municipio: 'La Victoria',
    cName: 'La Victoria',
    ctId: '76.403'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.497',
    municipio: 'Obando',
    cName: 'Obando',
    ctId: '76.497'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.520',
    municipio: 'Palmira',
    cName: 'Palmira',
    ctId: '76.520'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.563',
    municipio: 'Pradera',
    cName: 'Pradera',
    ctId: '76.563'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.606',
    municipio: 'Restrepo',
    cName: 'Restrepo',
    ctId: '76.606'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.616',
    municipio: 'Riofrio',
    cName: 'Riofrio',
    ctId: '76.616'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.622',
    municipio: 'Roldanillo',
    cName: 'Roldanillo',
    ctId: '76.622'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.670',
    municipio: 'San Pedro',
    cName: 'San Pedro',
    ctId: '76.670'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.736',
    municipio: 'Sevilla',
    cName: 'Sevilla',
    ctId: '76.736'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.823',
    municipio: 'Toro',
    cName: 'Toro',
    ctId: '76.823'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.828',
    municipio: 'Trujillo',
    cName: 'Trujillo',
    ctId: '76.828'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.834',
    municipio: 'Tulua',
    cName: 'Tulua',
    ctId: '76.834'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.845',
    municipio: 'Ulloa',
    cName: 'Ulloa',
    ctId: '76.845'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.863',
    municipio: 'Versalles',
    cName: 'Versalles',
    ctId: '76.863'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.869',
    municipio: 'Vijes',
    cName: 'Vijes',
    ctId: '76.869'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.890',
    municipio: 'Yotoco',
    cName: 'Yotoco',
    ctId: '76.890'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.892',
    municipio: 'Yumbo',
    cName: 'Yumbo',
    ctId: '76.892'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '76',
    departamento: 'Valle',
    c_digo_dane_del_municipio: '76.895',
    municipio: 'Zarzal',
    cName: 'Zarzal',
    ctId: '76.895'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '81',
    departamento: 'Arauca',
    c_digo_dane_del_municipio: '81.001',
    municipio: 'Arauca',
    cName: 'Arauca',
    ctId: '81.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '81',
    departamento: 'Arauca',
    c_digo_dane_del_municipio: '81.065',
    municipio: 'Arauquita',
    cName: 'Arauquita',
    ctId: '81.065'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '81',
    departamento: 'Arauca',
    c_digo_dane_del_municipio: '81.220',
    municipio: 'Cravo Norte',
    cName: 'Cravo Norte',
    ctId: '81.220'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '81',
    departamento: 'Arauca',
    c_digo_dane_del_municipio: '81.300',
    municipio: 'Fortul',
    cName: 'Fortul',
    ctId: '81.300'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '81',
    departamento: 'Arauca',
    c_digo_dane_del_municipio: '81.591',
    municipio: 'Puerto Rondon',
    cName: 'Puerto Rondon',
    ctId: '81.591'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '81',
    departamento: 'Arauca',
    c_digo_dane_del_municipio: '81.736',
    municipio: 'Saravena',
    cName: 'Saravena',
    ctId: '81.736'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '81',
    departamento: 'Arauca',
    c_digo_dane_del_municipio: '81.794',
    municipio: 'Tame',
    cName: 'Tame',
    ctId: '81.794'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.001',
    municipio: 'Yopal',
    cName: 'Yopal',
    ctId: '85.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.010',
    municipio: 'Aguazul',
    cName: 'Aguazul',
    ctId: '85.010'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.015',
    municipio: 'Chameza',
    cName: 'Chameza',
    ctId: '85.015'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.125',
    municipio: 'Hato Corozal',
    cName: 'Hato Corozal',
    ctId: '85.125'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.136',
    municipio: 'La Salina',
    cName: 'La Salina',
    ctId: '85.136'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.139',
    municipio: 'Mani',
    cName: 'Mani',
    ctId: '85.139'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.162',
    municipio: 'Monterrey',
    cName: 'Monterrey',
    ctId: '85.162'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.225',
    municipio: 'Nunchia',
    cName: 'Nunchia',
    ctId: '85.225'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.230',
    municipio: 'Orocue',
    cName: 'Orocue',
    ctId: '85.230'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.250',
    municipio: 'Paz De Ariporo',
    cName: 'Paz De Ariporo',
    ctId: '85.250'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.263',
    municipio: 'Pore',
    cName: 'Pore',
    ctId: '85.263'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.279',
    municipio: 'Recetor',
    cName: 'Recetor',
    ctId: '85.279'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.300',
    municipio: 'Sabanalarga',
    cName: 'Sabanalarga',
    ctId: '85.300'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.315',
    municipio: 'Sacama',
    cName: 'Sacama',
    ctId: '85.315'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.325',
    municipio: 'San Luis De Palenque',
    cName: 'San Luis De Palenque',
    ctId: '85.325'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.400',
    municipio: 'Tamara',
    cName: 'Tamara',
    ctId: '85.400'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.410',
    municipio: 'Tauramena',
    cName: 'Tauramena',
    ctId: '85.410'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.430',
    municipio: 'Trinidad',
    cName: 'Trinidad',
    ctId: '85.430'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '85',
    departamento: 'Casanare',
    c_digo_dane_del_municipio: '85.440',
    municipio: 'Villanueva',
    cName: 'Villanueva',
    ctId: '85.440'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.001',
    municipio: 'Mocoa',
    cName: 'Mocoa',
    ctId: '86.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.219',
    municipio: 'Colon',
    cName: 'Colon',
    ctId: '86.219'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.320',
    municipio: 'Orito',
    cName: 'Orito',
    ctId: '86.320'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.568',
    municipio: 'Puerto Asis',
    cName: 'Puerto Asis',
    ctId: '86.568'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.569',
    municipio: 'Puerto Caicedo',
    cName: 'Puerto Caicedo',
    ctId: '86.569'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.571',
    municipio: 'Puerto Guzman',
    cName: 'Puerto Guzman',
    ctId: '86.571'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.573',
    municipio: 'Puerto Leguizamo',
    cName: 'Puerto Leguizamo',
    ctId: '86.573'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.749',
    municipio: 'Sibundoy',
    cName: 'Sibundoy',
    ctId: '86.749'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.755',
    municipio: 'San Francisco',
    cName: 'San Francisco',
    ctId: '86.755'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.757',
    municipio: 'San Miguel (la Dorada)',
    cName: 'San Miguel (la Dorada)',
    ctId: '86.757'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.760',
    municipio: 'Santiago',
    cName: 'Santiago',
    ctId: '86.760'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.865',
    municipio: 'La Hormiga (valle Del\nguamuez)',
    cName: 'La Hormiga (valle Del\nguamuez)',
    ctId: '86.865'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '86',
    departamento: 'Putumayo',
    c_digo_dane_del_municipio: '86.885',
    municipio: 'Villagarzon',
    cName: 'Villagarzon',
    ctId: '86.885'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '88',
    departamento: 'San Andres',
    c_digo_dane_del_municipio: '88.001',
    municipio: 'San Andres',
    cName: 'San Andres',
    ctId: '88.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '88',
    departamento: 'San Andres',
    c_digo_dane_del_municipio: '88.564',
    municipio: 'Providencia',
    cName: 'Providencia',
    ctId: '88.564'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.001',
    municipio: 'Leticia',
    cName: 'Leticia',
    ctId: '91.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.263',
    municipio: 'El Encanto',
    cName: 'El Encanto',
    ctId: '91.263'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.405',
    municipio: 'La Chorrera',
    cName: 'La Chorrera',
    ctId: '91.405'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.407',
    municipio: 'La Pedrera',
    cName: 'La Pedrera',
    ctId: '91.407'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.430',
    municipio: 'La Victoria',
    cName: 'La Victoria',
    ctId: '91.430'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.460',
    municipio: 'Miriti-parana',
    cName: 'Miriti-parana',
    ctId: '91.460'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.530',
    municipio: 'Puerto Alegria',
    cName: 'Puerto Alegria',
    ctId: '91.530'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.536',
    municipio: 'Puerto Arica',
    cName: 'Puerto Arica',
    ctId: '91.536'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.540',
    municipio: 'Puerto Nariño',
    cName: 'Puerto Nariño',
    ctId: '91.540'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.669',
    municipio: 'Puerto Santander',
    cName: 'Puerto Santander',
    ctId: '91.669'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '91',
    departamento: 'Amazonas',
    c_digo_dane_del_municipio: '91.798',
    municipio: 'Tarapaca',
    cName: 'Tarapaca',
    ctId: '91.798'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.001',
    municipio: 'Puerto Inirida',
    cName: 'Puerto Inirida',
    ctId: '94.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.343',
    municipio: 'Barranco Minas',
    cName: 'Barranco Minas',
    ctId: '94.343'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.883',
    municipio: 'San Felipe',
    cName: 'San Felipe',
    ctId: '94.883'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.884',
    municipio: 'Puerto Colombia',
    cName: 'Puerto Colombia',
    ctId: '94.884'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.885',
    municipio: 'La Guadalupe',
    cName: 'La Guadalupe',
    ctId: '94.885'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.886',
    municipio: 'Cacahual',
    cName: 'Cacahual',
    ctId: '94.886'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.887',
    municipio: 'Pana Pana (campo\nalegre)',
    cName: 'Pana Pana (campo\nalegre)',
    ctId: '94.887'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '94',
    departamento: 'Guainia',
    c_digo_dane_del_municipio: '94.888',
    municipio: 'Morichal (morichal\nnuevo)',
    cName: 'Morichal (morichal\nnuevo)',
    ctId: '94.888'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '95',
    departamento: 'Guaviare',
    c_digo_dane_del_municipio: '95.001',
    municipio: 'San Jose Del Guaviare',
    cName: 'San Jose Del Guaviare',
    ctId: '95.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '95',
    departamento: 'Guaviare',
    c_digo_dane_del_municipio: '95.015',
    municipio: 'Calamar',
    cName: 'Calamar',
    ctId: '95.015'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '95',
    departamento: 'Guaviare',
    c_digo_dane_del_municipio: '95.025',
    municipio: 'El Retorno',
    cName: 'El Retorno',
    ctId: '95.025'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '95',
    departamento: 'Guaviare',
    c_digo_dane_del_municipio: '95.200',
    municipio: 'Miraflores',
    cName: 'Miraflores',
    ctId: '95.200'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '97',
    departamento: 'Vaupes',
    c_digo_dane_del_municipio: '97.001',
    municipio: 'Mitu',
    cName: 'Mitu',
    ctId: '97.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '97',
    departamento: 'Vaupes',
    c_digo_dane_del_municipio: '97.161',
    municipio: 'Caruru',
    cName: 'Caruru',
    ctId: '97.161'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '97',
    departamento: 'Vaupes',
    c_digo_dane_del_municipio: '97.511',
    municipio: 'Pacoa',
    cName: 'Pacoa',
    ctId: '97.511'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '97',
    departamento: 'Vaupes',
    c_digo_dane_del_municipio: '97.666',
    municipio: 'Taraira',
    cName: 'Taraira',
    ctId: '97.666'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '97',
    departamento: 'Vaupes',
    c_digo_dane_del_municipio: '97.777',
    municipio: 'Papunaua (morichal)',
    cName: 'Papunaua (morichal)',
    ctId: '97.777'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '97',
    departamento: 'Vaupes',
    c_digo_dane_del_municipio: '97.889',
    municipio: 'Yavarate',
    cName: 'Yavarate',
    ctId: '97.889'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '99',
    departamento: 'Vichada',
    c_digo_dane_del_municipio: '99.001',
    municipio: 'Puerto Carreño',
    cName: 'Puerto Carreño',
    ctId: '99.001'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '99',
    departamento: 'Vichada',
    c_digo_dane_del_municipio: '99.524',
    municipio: 'La Primavera',
    cName: 'La Primavera',
    ctId: '99.524'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '99',
    departamento: 'Vichada',
    c_digo_dane_del_municipio: '99.572',
    municipio: 'Santa Rita',
    cName: 'Santa Rita',
    ctId: '99.572'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '99',
    departamento: 'Vichada',
    c_digo_dane_del_municipio: '99.666',
    municipio: 'Santa Rosalia',
    cName: 'Santa Rosalia',
    ctId: '99.666'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '99',
    departamento: 'Vichada',
    c_digo_dane_del_municipio: '99.760',
    municipio: 'San Jose De Ocune',
    cName: 'San Jose De Ocune',
    ctId: '99.760'
  },
  {
    region: 'Unknown',
    c_digo_dane_del_departamento: '99',
    departamento: 'Vichada',
    c_digo_dane_del_municipio: '99.773',
    municipio: 'Cumaribo',
    cName: 'Cumaribo',
    ctId: '99.773'
  }
]