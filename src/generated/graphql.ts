import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Area = {
  __typename?: 'Area';
  aDatCre?: Maybe<Scalars['DateTime']['output']>;
  aDatMod?: Maybe<Scalars['DateTime']['output']>;
  aId: Scalars['ID']['output'];
  aName: Scalars['String']['output'];
  aState?: Maybe<Scalars['Int']['output']>;
  pId: Scalars['ID']['output'];
};

/** Response for user login */
export type AuthPayload = {
  __typename?: 'AuthPayload';
  admin?: Maybe<Scalars['Boolean']['output']>;
  idStore?: Maybe<Scalars['String']['output']>;
  isVerifyEmail?: Maybe<Scalars['Boolean']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  newRefreshToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
  storeUserId?: Maybe<Scalars['ID']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export type AvailableProduct = {
  __typename?: 'AvailableProduct';
  availableProductId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dayAvailable?: Maybe<Scalars['Int']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  pId?: Maybe<Scalars['ID']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CatStore = {
  __typename?: 'CatStore';
  cName?: Maybe<Scalars['String']['output']>;
  cPathImage?: Maybe<Scalars['String']['output']>;
  cState?: Maybe<Scalars['Int']['output']>;
  catStore?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  csDescription?: Maybe<Scalars['String']['output']>;
  getAllStore?: Maybe<Array<Maybe<Store>>>;
  idUser?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type City = {
  __typename?: 'City';
  cDatCre?: Maybe<Scalars['DateTime']['output']>;
  cDatMod?: Maybe<Scalars['DateTime']['output']>;
  cName: Scalars['String']['output'];
  cState?: Maybe<Scalars['Int']['output']>;
  ctId: Scalars['ID']['output'];
  dId?: Maybe<Scalars['ID']['output']>;
};

export type Clients = {
  __typename?: 'Clients';
  ClientAddress?: Maybe<Scalars['String']['output']>;
  ccClient?: Maybe<Scalars['String']['output']>;
  clState?: Maybe<Scalars['Int']['output']>;
  cliId?: Maybe<Scalars['ID']['output']>;
  clientLastName?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  clientNumber?: Maybe<Scalars['String']['output']>;
  createAt?: Maybe<Scalars['DateTime']['output']>;
  gender?: Maybe<Scalars['Int']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  idUser?: Maybe<Scalars['ID']['output']>;
  updateAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Country = {
  __typename?: 'Country';
  cCalCod?: Maybe<Scalars['String']['output']>;
  cDatCre?: Maybe<Scalars['DateTime']['output']>;
  cDatMod?: Maybe<Scalars['DateTime']['output']>;
  cId: Scalars['ID']['output'];
  cName?: Maybe<Scalars['String']['output']>;
  cState?: Maybe<Scalars['Int']['output']>;
};

export type CreatePaymentMethodInput = {
  icon: Scalars['String']['input'];
  mIcon?: InputMaybe<Scalars['Int']['input']>;
  mState?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  payId: Scalars['ID']['input'];
  paymentPriority: Scalars['Int']['input'];
  state: Scalars['String']['input'];
};

export type CreateRoleResponse = {
  __typename?: 'CreateRoleResponse';
  data?: Maybe<Roles>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type DashboardComponent = {
  __typename?: 'DashboardComponent';
  coordinates?: Maybe<Scalars['JSON']['output']>;
  createAt?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  idUser?: Maybe<Scalars['ID']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updateAt?: Maybe<Scalars['String']['output']>;
};

export type DashboardComponentInput = {
  coordinates: Scalars['JSON']['input'];
  idStore?: InputMaybe<Scalars['ID']['input']>;
  idUser?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type DashboardComponentUpdateInput = {
  coordinates?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Department = {
  __typename?: 'Department';
  cId?: Maybe<Scalars['ID']['output']>;
  code_dId?: Maybe<Scalars['String']['output']>;
  dDatCre?: Maybe<Scalars['DateTime']['output']>;
  dDatMod?: Maybe<Scalars['DateTime']['output']>;
  dId: Scalars['ID']['output'];
  dName: Scalars['String']['output'];
  dState?: Maybe<Scalars['Int']['output']>;
};

export type DeviceUser = {
  __typename?: 'DeviceUser';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dId?: Maybe<Scalars['ID']['output']>;
  dState?: Maybe<Scalars['Int']['output']>;
  deviceId?: Maybe<Scalars['String']['output']>;
  deviceName?: Maybe<Scalars['String']['output']>;
  family?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  ip?: Maybe<Scalars['String']['output']>;
  isBot?: Maybe<Scalars['Boolean']['output']>;
  locationFormat?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  os?: Maybe<Scalars['String']['output']>;
  platform?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type DeviceUserInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  dState?: InputMaybe<Scalars['Int']['input']>;
  deviceId: Scalars['String']['input'];
  deviceName?: InputMaybe<Scalars['String']['input']>;
  family?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  ip?: InputMaybe<Scalars['String']['input']>;
  isBot?: InputMaybe<Scalars['Boolean']['input']>;
  locationFormat?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  os?: InputMaybe<Scalars['String']['input']>;
  platform?: InputMaybe<Scalars['String']['input']>;
  shortName?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type DeviceUserResponse = {
  __typename?: 'DeviceUserResponse';
  data?: Maybe<DeviceUser>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type EditExtProductFoodOptionalInput = {
  ExtProductFoodsSubOptionalAll?: InputMaybe<Array<InputMaybe<EditExtProductFoodSubOptionalInput>>>;
  OptionalProName?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  numbersOptionalOnly?: InputMaybe<Scalars['Int']['input']>;
  opExPid?: InputMaybe<Scalars['ID']['input']>;
  pId: Scalars['ID']['input'];
  required?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type EditExtProductFoodSubOptionalInput = {
  OptionalSubProName?: InputMaybe<Scalars['String']['input']>;
  exCode?: InputMaybe<Scalars['String']['input']>;
  exCodeOptionExtra?: InputMaybe<Scalars['String']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  opExPid?: InputMaybe<Scalars['ID']['input']>;
  opSubExPid?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};

export type ExtProductFood = {
  __typename?: 'ExtProductFood';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  exPid?: Maybe<Scalars['ID']['output']>;
  exState?: Maybe<Scalars['Int']['output']>;
  extraName?: Maybe<Scalars['String']['output']>;
  extraPrice?: Maybe<Scalars['Float']['output']>;
  newExtraPrice?: Maybe<Scalars['Int']['output']>;
  pId: Scalars['ID']['output'];
  quantity?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExtProductFoodInput = {
  createdAt?: InputMaybe<Scalars['String']['input']>;
  exPid?: InputMaybe<Scalars['String']['input']>;
  exState?: InputMaybe<Scalars['Int']['input']>;
  extraName?: InputMaybe<Scalars['String']['input']>;
  extraPrice?: InputMaybe<Scalars['Float']['input']>;
  newExtraPrice?: InputMaybe<Scalars['Float']['input']>;
  pId?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type ExtProductFoodOptional = {
  __typename?: 'ExtProductFoodOptional';
  ExtProductFoodsSubOptionalAll?: Maybe<Array<Maybe<ExtProductFoodSubOptional>>>;
  OptionalProName?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  numbersOptionalOnly?: Maybe<Scalars['Int']['output']>;
  opExPid?: Maybe<Scalars['ID']['output']>;
  pId: Scalars['ID']['output'];
  required?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExtProductFoodOptionalInput = {
  ExtProductFoodsSubOptionalAll?: InputMaybe<Array<InputMaybe<ExtProductFoodSubOptionalInput>>>;
  OptionalProName?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  numbersOptionalOnly?: InputMaybe<Scalars['Int']['input']>;
  opExPid?: InputMaybe<Scalars['String']['input']>;
  pId?: InputMaybe<Scalars['String']['input']>;
  required?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type ExtProductFoodSubOptional = {
  __typename?: 'ExtProductFoodSubOptional';
  OptionalSubProName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  exCode?: Maybe<Scalars['String']['output']>;
  exCodeOptionExtra?: Maybe<Scalars['String']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  opExPid?: Maybe<Scalars['ID']['output']>;
  opSubExPid?: Maybe<Scalars['ID']['output']>;
  pId?: Maybe<Scalars['ID']['output']>;
  state?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ExtProductFoodSubOptionalInput = {
  OptionalSubProName?: InputMaybe<Scalars['String']['input']>;
  check?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['String']['input']>;
  exCode?: InputMaybe<Scalars['String']['input']>;
  exCodeOptionExtra?: InputMaybe<Scalars['String']['input']>;
  idStore?: InputMaybe<Scalars['String']['input']>;
  opExPid?: InputMaybe<Scalars['String']['input']>;
  opSubExPid?: InputMaybe<Scalars['String']['input']>;
  pId?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['String']['input']>;
};

export type Feature = {
  __typename?: 'Feature';
  fId?: Maybe<Scalars['ID']['output']>;
  hpqrDatCre?: Maybe<Scalars['String']['output']>;
  hpqrDatMod?: Maybe<Scalars['String']['output']>;
  hpqrQuestion?: Maybe<Scalars['String']['output']>;
  hpqrState?: Maybe<Scalars['String']['output']>;
  thpId?: Maybe<Scalars['ID']['output']>;
  typeFeature?: Maybe<TypeFeature>;
};

export type IArea = {
  aId?: InputMaybe<Scalars['ID']['input']>;
  aName: Scalars['String']['input'];
  aState?: InputMaybe<Scalars['Int']['input']>;
  pId: Scalars['ID']['input'];
};

export type IAvailableProduct = {
  availableProductId?: InputMaybe<Scalars['ID']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dayAvailable?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IBanner = {
  bnImage?: InputMaybe<Scalars['Upload']['input']>;
  idStore?: InputMaybe<Scalars['String']['input']>;
};

export type ICatStore = {
  cName?: InputMaybe<Scalars['String']['input']>;
  cPathImage?: InputMaybe<Scalars['String']['input']>;
  cState?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  csDescription?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ICategories = {
  caId?: InputMaybe<Scalars['ID']['input']>;
  cpImage?: InputMaybe<Scalars['String']['input']>;
  cpName?: InputMaybe<Scalars['String']['input']>;
  cpState?: InputMaybe<Scalars['Int']['input']>;
};

export type ICity = {
  cName?: InputMaybe<Scalars['String']['input']>;
  cState?: InputMaybe<Scalars['Int']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
};

export type IClients = {
  ClientAddress?: InputMaybe<Scalars['String']['input']>;
  ccClient?: InputMaybe<Scalars['String']['input']>;
  clState?: InputMaybe<Scalars['Int']['input']>;
  cliId?: InputMaybe<Scalars['ID']['input']>;
  clientLastName?: InputMaybe<Scalars['String']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  clientNumber?: InputMaybe<Scalars['String']['input']>;
  createAt?: InputMaybe<Scalars['DateTime']['input']>;
  gender?: InputMaybe<Scalars['Int']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  idUser?: InputMaybe<Scalars['ID']['input']>;
  updateAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ICountry = {
  cCalCod?: InputMaybe<Scalars['ID']['input']>;
  cId?: InputMaybe<Scalars['ID']['input']>;
  cName: Scalars['String']['input'];
  cState?: InputMaybe<Scalars['String']['input']>;
};

export type IDeleteCountries = {
  cCalCod?: InputMaybe<Scalars['ID']['input']>;
  cId?: InputMaybe<Scalars['ID']['input']>;
  cState?: InputMaybe<Scalars['String']['input']>;
};

export type IDeleteProductFood = {
  pId?: InputMaybe<Scalars['ID']['input']>;
};

export type IDepartment = {
  cId: Scalars['ID']['input'];
  dId?: InputMaybe<Scalars['ID']['input']>;
  dName: Scalars['String']['input'];
  dState?: InputMaybe<Scalars['Int']['input']>;
};

export type IEditCountries = {
  cCalCod?: InputMaybe<Scalars['ID']['input']>;
  cId?: InputMaybe<Scalars['ID']['input']>;
  cName?: InputMaybe<Scalars['String']['input']>;
  cState?: InputMaybe<Scalars['String']['input']>;
};

export type IEditDepartments = {
  cId: Scalars['ID']['input'];
  dId?: InputMaybe<Scalars['ID']['input']>;
  dName: Scalars['String']['input'];
  dState?: InputMaybe<Scalars['Int']['input']>;
};

export type IEditMunicipalities = {
  cName?: InputMaybe<Scalars['String']['input']>;
  cState?: InputMaybe<Scalars['Int']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
};

export type IFeature = {
  fId?: InputMaybe<Scalars['ID']['input']>;
  hpqrQuestion?: InputMaybe<Scalars['String']['input']>;
  hpqrState?: InputMaybe<Scalars['String']['input']>;
  thpId: Scalars['ID']['input'];
};

export type IFileImageProductFood = {
  image?: InputMaybe<Scalars['Upload']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
};

export type Iid_Sub = {
  _id?: InputMaybe<Scalars['ID']['input']>;
};

export type Iid_Sub_Items = {
  setID?: InputMaybe<Array<InputMaybe<Iid_Sub>>>;
};

export type ILineItemsExtraFinal = {
  setData?: InputMaybe<Array<InputMaybe<InputExtProductFood>>>;
};

export type ILineItemsIds = {
  idProduct?: InputMaybe<Scalars['ID']['input']>;
};

export type IParamsPriority = {
  idRole?: InputMaybe<Scalars['ID']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type IResponseData = {
  __typename?: 'IResponseData';
  ProImage?: Maybe<Scalars['String']['output']>;
  pId?: Maybe<Scalars['ID']['output']>;
};

export type IResponseMultipleTag = {
  __typename?: 'IResponseMultipleTag';
  data?: Maybe<Array<Maybe<TagsProduct>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type IResponseTag = {
  __typename?: 'IResponseTag';
  data?: Maybe<TagsProduct>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type IRole = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  idRole?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  permissions: Scalars['JSON']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IShoppingCart = {
  ProPrice?: InputMaybe<Scalars['Float']['input']>;
  cantProducts?: InputMaybe<Scalars['Int']['input']>;
  comments?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  dataExtra?: InputMaybe<Array<InputMaybe<ExtProductFoodInput>>>;
  dataOptional?: InputMaybe<Array<InputMaybe<ExtProductFoodOptionalInput>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  idUser?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  priceProduct?: InputMaybe<Scalars['Float']['input']>;
  refCodePid?: InputMaybe<Scalars['String']['input']>;
  sState?: InputMaybe<Scalars['Int']['input']>;
  shoppingCartId?: InputMaybe<Scalars['ID']['input']>;
  shoppingCartRefCode?: InputMaybe<Scalars['String']['input']>;
  totalExtra?: InputMaybe<Scalars['Float']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type IStore = {
  Image?: InputMaybe<Scalars['String']['input']>;
  ImageName?: InputMaybe<Scalars['String']['input']>;
  NitStore?: InputMaybe<Scalars['String']['input']>;
  ULocation?: InputMaybe<Scalars['String']['input']>;
  Viaprincipal?: InputMaybe<Scalars['String']['input']>;
  addressStore?: InputMaybe<Scalars['String']['input']>;
  banner?: InputMaybe<Scalars['String']['input']>;
  cId?: InputMaybe<Scalars['ID']['input']>;
  catStore?: InputMaybe<Scalars['ID']['input']>;
  createAt?: InputMaybe<Scalars['DateTime']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  documentIdentifier?: InputMaybe<Scalars['String']['input']>;
  emailStore?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  neighborhoodStore?: InputMaybe<Scalars['String']['input']>;
  secVia?: InputMaybe<Scalars['String']['input']>;
  siteWeb?: InputMaybe<Scalars['String']['input']>;
  socialRaz?: InputMaybe<Scalars['String']['input']>;
  storeName?: InputMaybe<Scalars['String']['input']>;
  storeOwner?: InputMaybe<Scalars['String']['input']>;
  storePhone?: InputMaybe<Scalars['String']['input']>;
  typeContribute?: InputMaybe<Scalars['String']['input']>;
  typeRegiments?: InputMaybe<Scalars['String']['input']>;
  uPhoNum?: InputMaybe<Scalars['String']['input']>;
  uState?: InputMaybe<Scalars['String']['input']>;
  upLat?: InputMaybe<Scalars['String']['input']>;
  upLon?: InputMaybe<Scalars['String']['input']>;
};

export type ITag = {
  aName?: InputMaybe<Scalars['String']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  idUser?: InputMaybe<Scalars['ID']['input']>;
  nameTag?: InputMaybe<Scalars['String']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};

export type ITstoreSchedule = {
  id?: InputMaybe<Scalars['ID']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  schDay?: InputMaybe<Scalars['Int']['input']>;
  schHoEnd?: InputMaybe<Scalars['String']['input']>;
  schHoSta?: InputMaybe<Scalars['String']['input']>;
  schId?: InputMaybe<Scalars['ID']['input']>;
  schState?: InputMaybe<Scalars['Int']['input']>;
};

export type ITypeFeature = {
  thpIcon?: InputMaybe<Scalars['String']['input']>;
  thpId: Scalars['ID']['input'];
  thpName?: InputMaybe<Scalars['String']['input']>;
  thpState?: InputMaybe<Scalars['String']['input']>;
};

export type InputCatProducts = {
  ProDescription?: InputMaybe<Scalars['String']['input']>;
  ProImage?: InputMaybe<Scalars['String']['input']>;
  carProId?: InputMaybe<Scalars['ID']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  pName?: InputMaybe<Scalars['String']['input']>;
  pState?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type InputExtProductFood = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exPid?: InputMaybe<Scalars['ID']['input']>;
  exState?: InputMaybe<Scalars['Int']['input']>;
  extraName?: InputMaybe<Scalars['String']['input']>;
  extraPrice?: InputMaybe<Scalars['Float']['input']>;
  pId: Scalars['ID']['input'];
  state?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type InputExtProductFoodOptional = {
  OptionalProName?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  numbersOptionalOnly?: InputMaybe<Scalars['Int']['input']>;
  opExPid?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  required?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};

export type InputExtProductFoodSubOptional = {
  OptionalSubProName?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  exCode?: InputMaybe<Scalars['String']['input']>;
  exCodeOptionExtra?: InputMaybe<Scalars['String']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  opExPid?: InputMaybe<Scalars['ID']['input']>;
  opSubExPid?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type InputProductFood = {
  ProAssurance?: InputMaybe<Scalars['String']['input']>;
  ProBarCode?: InputMaybe<Scalars['String']['input']>;
  ProDelivery?: InputMaybe<Scalars['Int']['input']>;
  ProDescription?: InputMaybe<Scalars['String']['input']>;
  ProDescuento?: InputMaybe<Scalars['Float']['input']>;
  ProHeight?: InputMaybe<Scalars['Float']['input']>;
  ProImage?: InputMaybe<Scalars['String']['input']>;
  ProLength?: InputMaybe<Scalars['String']['input']>;
  ProOutstanding?: InputMaybe<Scalars['Int']['input']>;
  ProPrice?: InputMaybe<Scalars['Float']['input']>;
  ProProtegido?: InputMaybe<Scalars['Int']['input']>;
  ProQuantity?: InputMaybe<Scalars['Int']['input']>;
  ProStar?: InputMaybe<Scalars['Int']['input']>;
  ProUniDisponibles?: InputMaybe<Scalars['String']['input']>;
  ProVoltaje?: InputMaybe<Scalars['String']['input']>;
  ProWeight?: InputMaybe<Scalars['String']['input']>;
  ProWidth?: InputMaybe<Scalars['Int']['input']>;
  ValueDelivery?: InputMaybe<Scalars['Float']['input']>;
  cId?: InputMaybe<Scalars['ID']['input']>;
  caId?: InputMaybe<Scalars['ID']['input']>;
  carProId?: InputMaybe<Scalars['ID']['input']>;
  colorId?: InputMaybe<Scalars['ID']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  fId?: InputMaybe<Scalars['ID']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  manageStock?: InputMaybe<Scalars['Boolean']['input']>;
  pCode?: InputMaybe<Scalars['String']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  pName?: InputMaybe<Scalars['String']['input']>;
  pState?: InputMaybe<Scalars['Int']['input']>;
  sTateLogistic?: InputMaybe<Scalars['Int']['input']>;
  sizeId?: InputMaybe<Scalars['ID']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  vat?: InputMaybe<Scalars['Float']['input']>;
};

export type IsStoreSchedule = {
  schData?: InputMaybe<Array<InputMaybe<ITstoreSchedule>>>;
};

export type LineItemsIdPro = {
  idCat?: InputMaybe<Scalars['ID']['input']>;
  setData?: InputMaybe<Array<InputMaybe<ILineItemsIds>>>;
};

export type Module = {
  __typename?: 'Module';
  mIcon?: Maybe<Scalars['String']['output']>;
  mId?: Maybe<Scalars['ID']['output']>;
  mName?: Maybe<Scalars['String']['output']>;
  mPath?: Maybe<Scalars['String']['output']>;
  mPriority?: Maybe<Scalars['Float']['output']>;
  subModules?: Maybe<Array<Maybe<SubModule>>>;
  view?: Maybe<Scalars['String']['output']>;
};

export type ModuleInput = {
  mIcon?: InputMaybe<Scalars['String']['input']>;
  mId?: InputMaybe<Scalars['ID']['input']>;
  mName?: InputMaybe<Scalars['String']['input']>;
  mPath?: InputMaybe<Scalars['String']['input']>;
  mPriority?: InputMaybe<Scalars['Float']['input']>;
  subModules?: InputMaybe<Array<InputMaybe<SubModuleInput>>>;
};

export type ModuleInputLineItem = {
  setDataModule?: InputMaybe<Array<InputMaybe<SubModuleInputLineItem>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  DeleteExtFoodSubsOptional?: Maybe<Response>;
  DeleteExtProductFoodsOptional?: Maybe<Response>;
  EditTags?: Maybe<TagsProduct>;
  /** Registra un area */
  createArea?: Maybe<Area>;
  /** Registra una ciudad sobre un departamento */
  createCity?: Maybe<City>;
  /** Registra un cliente */
  createClients?: Maybe<ResponseClient>;
  /** Registra un cliente */
  createCountry?: Maybe<Country>;
  createDashboardComponent: ResponseDashboardComponent;
  /** Registra un cliente */
  createDepartments?: Maybe<Department>;
  /** Registra un createFeature */
  createFeature?: Maybe<Feature>;
  createFeatureType?: Maybe<TypeFeature>;
  createModule?: Maybe<Response>;
  createOrder?: Maybe<OrderPapu>;
  createOrderStatusType: ResponseOrderStatusType;
  createPaymentMethod: PaymentMethod;
  /** Response for user login */
  createRoleMutation?: Maybe<CreateRoleResponse>;
  createSubModule?: Maybe<Response>;
  createUser?: Maybe<User>;
  deleteALogoStore?: Maybe<ResponseUploadLogo>;
  deleteCatFinalOfProducts?: Maybe<AuthPayload>;
  deleteCatOfProducts?: Maybe<AuthPayload>;
  deleteClient?: Maybe<Response>;
  deleteCountries?: Maybe<Country>;
  deleteDashboardComponent: ResponseDashboardComponent;
  deleteExtraProduct?: Maybe<Response>;
  deleteModule?: Maybe<Response>;
  deleteOneBanner: RegisterBannerResponse;
  deleteOneItem?: Maybe<Response>;
  deleteOneModule?: Maybe<Scalars['Boolean']['output']>;
  deleteOneTag?: Maybe<IResponseTag>;
  deleteOrderStatusType: Scalars['Boolean']['output'];
  deletePaymentMethod: Scalars['Boolean']['output'];
  /** Borra un productFoodo */
  deleteProductFoods?: Maybe<ProductFood>;
  deleteSubModule?: Maybe<Response>;
  desCategoryStore?: Maybe<Scalars['Boolean']['output']>;
  editAvailableProduct?: Maybe<Scalars['Boolean']['output']>;
  editCountries?: Maybe<Country>;
  editDepartments?: Maybe<Department>;
  editExtFoodSubsOptional?: Maybe<Response>;
  /** EDITA UN EXTRAPRODUCTOPTIONAL */
  editExtProductFoodOptional?: Maybe<ExtProductFoodOptional>;
  editExtProductFoods?: Maybe<Response>;
  editExtraProductFoods?: Maybe<Response>;
  editModule?: Maybe<Module>;
  /** Edita un IMunicipalities */
  editMunicipalities?: Maybe<City>;
  editOneCategoryProduct?: Maybe<Response>;
  editOneClient?: Maybe<Response>;
  /** edita un productFoodo */
  editProductFoods?: Maybe<Response>;
  loginUser?: Maybe<AuthPayload>;
  /** Register DeviceUser data */
  newRegisterDeviceUser?: Maybe<DeviceUserResponse>;
  newRegisterStore?: Maybe<AuthPayload>;
  printSaleTicket: PrintSaleTicketResponse;
  registerAvailableProduct?: Maybe<ResponseAvailableProduct>;
  registerBanner: RegisterBannerResponse;
  registerCategoryStore?: Maybe<CatStore>;
  /** Uploads a logo image for the specified store. */
  registerLogo?: Maybe<ResponseUploadLogo>;
  registerModule?: Maybe<Module>;
  registerMultipleTags?: Maybe<IResponseMultipleTag>;
  registerSalesStore?: Maybe<ResponseSalesStore>;
  registerShoppingCart?: Maybe<ResponseShoppingCart>;
  registerTag?: Maybe<IResponseTag>;
  registerTagName?: Maybe<IResponseTag>;
  registerUser?: Maybe<AuthPayload>;
  removeRoles?: Maybe<UpdateRoleResponse>;
  setImageProducts?: Maybe<ResponseMessageImageProduct>;
  setScheduleOpenAll?: Maybe<Response>;
  setStoreSchedule?: Maybe<ResponseScheduleStore>;
  setStoreScheduleReserve?: Maybe<Array<Maybe<StoreSchedule>>>;
  storeTable?: Maybe<TableResponse>;
  storeTableCreate?: Maybe<TableResponse>;
  updateDashboardComponent?: Maybe<ResponseDashboardComponent>;
  /** Registra un ExtProductFood */
  updateExtProductFoods?: Maybe<ExtProductFood>;
  /** Registra un ExtProductFoodOptional */
  updateExtProductOptional?: Maybe<Response>;
  /** Registra un ExtProductFoodSubOptional */
  updateExtProductSubOptional?: Maybe<ResponseExtProductFoodSubOptional>;
  updateModuleOrder?: Maybe<UpdateModuleOrderPayload>;
  updateMultipleExtProduct?: Maybe<ResponseExtProduct>;
  updateMultipleProducts?: Maybe<Array<Maybe<ResponseProduct>>>;
  updateOrderStatusPriorities?: Maybe<OrderStatusResponse>;
  updateOrderStatusType: OrderStatusType;
  updatePaymentMethod: PaymentMethod;
  /** Registra un productFood */
  updateProductFoods?: Maybe<ResponseProduct>;
  updateRolesPriority?: Maybe<UpdateRoleResponse>;
  updateStoreTable?: Maybe<TableResponse>;
  updatedCatWithProducts?: Maybe<AuthPayload>;
  /** Registra un catProductso */
  updatedProducts?: Maybe<ResponseCategoryProduct>;
};


export type MutationDeleteExtFoodSubsOptionalArgs = {
  isCustomSubOpExPid?: InputMaybe<Scalars['Boolean']['input']>;
  opSubExPid?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteExtProductFoodsOptionalArgs = {
  isCustomOpExPid?: InputMaybe<Scalars['Boolean']['input']>;
  opExPid?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationEditTagsArgs = {
  input?: InputMaybe<ITag>;
};


export type MutationCreateAreaArgs = {
  input: IArea;
};


export type MutationCreateCityArgs = {
  input?: InputMaybe<ICity>;
};


export type MutationCreateClientsArgs = {
  input?: InputMaybe<IClients>;
};


export type MutationCreateCountryArgs = {
  input?: InputMaybe<ICountry>;
};


export type MutationCreateDashboardComponentArgs = {
  input: DashboardComponentInput;
};


export type MutationCreateDepartmentsArgs = {
  input?: InputMaybe<IDepartment>;
};


export type MutationCreateFeatureArgs = {
  input?: InputMaybe<IFeature>;
};


export type MutationCreateFeatureTypeArgs = {
  input?: InputMaybe<ITypeFeature>;
};


export type MutationCreateModuleArgs = {
  input?: InputMaybe<ModuleInput>;
  inputLineItemsMod?: InputMaybe<ModuleInputLineItem>;
};


export type MutationCreateOrderArgs = {
  id: Scalars['String']['input'];
  idStore: Scalars['String']['input'];
  pdpId: Scalars['String']['input'];
  totalProductsPrice: Scalars['Int']['input'];
  unidProducts: Scalars['Int']['input'];
};


export type MutationCreateOrderStatusTypeArgs = {
  data: OrderStatusTypeInput;
};


export type MutationCreatePaymentMethodArgs = {
  input: CreatePaymentMethodInput;
};


export type MutationCreateRoleMutationArgs = {
  input?: InputMaybe<IRole>;
};


export type MutationCreateSubModuleArgs = {
  input?: InputMaybe<SubModuleInputLineItem>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteALogoStoreArgs = {
  Image?: InputMaybe<Scalars['String']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteCatFinalOfProductsArgs = {
  idPc?: InputMaybe<Scalars['ID']['input']>;
  withProduct?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationDeleteCatOfProductsArgs = {
  idPc: Scalars['ID']['input'];
  pState?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteClientArgs = {
  clState: Scalars['Int']['input'];
  cliId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteCountriesArgs = {
  input: IDeleteCountries;
};


export type MutationDeleteDashboardComponentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteExtraProductArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteModuleArgs = {
  mId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteOneBannerArgs = {
  bnId?: InputMaybe<Scalars['ID']['input']>;
  bnImage?: InputMaybe<Scalars['String']['input']>;
  bnImageFileName?: InputMaybe<Scalars['String']['input']>;
  bnState?: InputMaybe<Scalars['Int']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteOneItemArgs = {
  ShoppingCart?: InputMaybe<Scalars['ID']['input']>;
  cState?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteOneModuleArgs = {
  mId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteOneTagArgs = {
  nameTag?: InputMaybe<Scalars['String']['input']>;
  tgId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDeleteOrderStatusTypeArgs = {
  idStatus: Scalars['ID']['input'];
};


export type MutationDeletePaymentMethodArgs = {
  payId: Scalars['ID']['input'];
};


export type MutationDeleteProductFoodsArgs = {
  input?: InputMaybe<IDeleteProductFood>;
};


export type MutationDeleteSubModuleArgs = {
  smId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationDesCategoryStoreArgs = {
  cState?: InputMaybe<Scalars['Int']['input']>;
  catStore?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationEditAvailableProductArgs = {
  pId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationEditCountriesArgs = {
  input: IEditCountries;
};


export type MutationEditDepartmentsArgs = {
  input: IEditDepartments;
};


export type MutationEditExtFoodSubsOptionalArgs = {
  OptionalSubProName?: InputMaybe<Scalars['String']['input']>;
  isCustomSubOpExPid?: InputMaybe<Scalars['Boolean']['input']>;
  opSubExPid?: InputMaybe<Scalars['ID']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationEditExtProductFoodOptionalArgs = {
  input: EditExtProductFoodOptionalInput;
};


export type MutationEditExtProductFoodsArgs = {
  input: InputExtProductFood;
};


export type MutationEditExtraProductFoodsArgs = {
  exPid?: InputMaybe<Scalars['ID']['input']>;
  extraName?: InputMaybe<Scalars['String']['input']>;
  extraPrice?: InputMaybe<Scalars['Float']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationEditModuleArgs = {
  input?: InputMaybe<ModuleInput>;
};


export type MutationEditMunicipalitiesArgs = {
  input: IEditMunicipalities;
};


export type MutationEditOneCategoryProductArgs = {
  ProDescription?: InputMaybe<Scalars['String']['input']>;
  carProId: Scalars['ID']['input'];
  pName: Scalars['String']['input'];
};


export type MutationEditOneClientArgs = {
  input?: InputMaybe<IClients>;
};


export type MutationEditProductFoodsArgs = {
  input?: InputMaybe<InputProductFood>;
};


export type MutationLoginUserArgs = {
  idBrowser?: InputMaybe<Scalars['String']['input']>;
  uEmail: Scalars['String']['input'];
  uPassword: Scalars['String']['input'];
};


export type MutationNewRegisterDeviceUserArgs = {
  input?: InputMaybe<DeviceUserInput>;
};


export type MutationNewRegisterStoreArgs = {
  input?: InputMaybe<IStore>;
};


export type MutationPrintSaleTicketArgs = {
  saleId: Scalars['ID']['input'];
};


export type MutationRegisterAvailableProductArgs = {
  input?: InputMaybe<Array<InputMaybe<IAvailableProduct>>>;
};


export type MutationRegisterBannerArgs = {
  input?: InputMaybe<IBanner>;
};


export type MutationRegisterCategoryStoreArgs = {
  input?: InputMaybe<ICatStore>;
};


export type MutationRegisterLogoArgs = {
  idStore?: InputMaybe<Scalars['ID']['input']>;
  logo?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationRegisterModuleArgs = {
  input?: InputMaybe<ModuleInput>;
  inputLineItemsMod?: InputMaybe<ModuleInputLineItem>;
};


export type MutationRegisterMultipleTagsArgs = {
  input: Array<InputMaybe<Scalars['String']['input']>>;
};


export type MutationRegisterSalesStoreArgs = {
  change?: InputMaybe<Scalars['Float']['input']>;
  discount?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  idSubArray?: InputMaybe<Iid_Sub_Items>;
  input?: InputMaybe<Array<InputMaybe<IShoppingCart>>>;
  pCodeRef?: InputMaybe<Scalars['String']['input']>;
  payId?: InputMaybe<Scalars['ID']['input']>;
  pickUp?: InputMaybe<Scalars['Int']['input']>;
  shoppingCartRefCode?: InputMaybe<Scalars['String']['input']>;
  tableId?: InputMaybe<Scalars['ID']['input']>;
  totalProductsPrice?: InputMaybe<Scalars['Float']['input']>;
  valueDelivery?: InputMaybe<Scalars['Float']['input']>;
};


export type MutationRegisterShoppingCartArgs = {
  idSubArray?: InputMaybe<Iid_Sub_Items>;
  input?: InputMaybe<IShoppingCart>;
};


export type MutationRegisterTagArgs = {
  input?: InputMaybe<ITag>;
};


export type MutationRegisterTagNameArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRegisterUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRemoveRolesArgs = {
  roleIds: Array<Scalars['ID']['input']>;
};


export type MutationSetImageProductsArgs = {
  input?: InputMaybe<IFileImageProductFood>;
};


export type MutationSetScheduleOpenAllArgs = {
  scheduleOpenAll: Scalars['Boolean']['input'];
};


export type MutationSetStoreScheduleArgs = {
  input: ITstoreSchedule;
};


export type MutationSetStoreScheduleReserveArgs = {
  input: IsStoreSchedule;
};


export type MutationStoreTableArgs = {
  seats?: InputMaybe<Scalars['Int']['input']>;
  section?: InputMaybe<Scalars['String']['input']>;
  tableName: Scalars['String']['input'];
  tableState?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationStoreTableCreateArgs = {
  seats?: InputMaybe<Scalars['Int']['input']>;
  section?: InputMaybe<Scalars['String']['input']>;
  tableName: Scalars['String']['input'];
  tableState?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateDashboardComponentArgs = {
  input?: InputMaybe<Array<InputMaybe<DashboardComponentUpdateInput>>>;
};


export type MutationUpdateExtProductFoodsArgs = {
  input?: InputMaybe<InputExtProductFood>;
};


export type MutationUpdateExtProductOptionalArgs = {
  input?: InputMaybe<InputExtProductFoodOptional>;
};


export type MutationUpdateExtProductSubOptionalArgs = {
  input?: InputMaybe<InputExtProductFoodSubOptional>;
};


export type MutationUpdateModuleOrderArgs = {
  input: Array<InputMaybe<UpdateModuleOrderInput>>;
};


export type MutationUpdateMultipleExtProductArgs = {
  inputLineItems?: InputMaybe<ILineItemsExtraFinal>;
};


export type MutationUpdateMultipleProductsArgs = {
  input?: InputMaybe<Array<InputMaybe<InputProductFood>>>;
};


export type MutationUpdateOrderStatusPrioritiesArgs = {
  data: Array<OrderStatusPriorityInput>;
};


export type MutationUpdateOrderStatusTypeArgs = {
  data: UpdateOrderStatusTypeInput;
};


export type MutationUpdatePaymentMethodArgs = {
  input: UpdatePaymentMethodInput;
  payId: Scalars['ID']['input'];
};


export type MutationUpdateProductFoodsArgs = {
  input?: InputMaybe<InputProductFood>;
};


export type MutationUpdateRolesPriorityArgs = {
  roles: Array<InputMaybe<IParamsPriority>>;
};


export type MutationUpdateStoreTableArgs = {
  seats?: InputMaybe<Scalars['Int']['input']>;
  section?: InputMaybe<Scalars['String']['input']>;
  tableId: Scalars['ID']['input'];
  tableName?: InputMaybe<Scalars['String']['input']>;
  tableState?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdatedCatWithProductsArgs = {
  input?: InputMaybe<LineItemsIdPro>;
};


export type MutationUpdatedProductsArgs = {
  input?: InputMaybe<InputCatProducts>;
};

export type OrderPapu = {
  __typename?: 'OrderPapu';
  id?: Maybe<Scalars['String']['output']>;
  idStore?: Maybe<Scalars['String']['output']>;
  pdpId?: Maybe<Scalars['String']['output']>;
  totalProductsPrice?: Maybe<Scalars['Int']['output']>;
  unidProducts?: Maybe<Scalars['Int']['output']>;
};

/** Input to update the priority of multiple status types */
export type OrderStatusPriorityInput = {
  idStatus: Scalars['ID']['input'];
  priority: Scalars['Int']['input'];
};

export type OrderStatusResponse = {
  __typename?: 'OrderStatusResponse';
  data?: Maybe<Array<Maybe<OrderStatusType>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** Represents the status type of an order */
export type OrderStatusType = {
  __typename?: 'OrderStatusType';
  backgroundColor?: Maybe<Scalars['String']['output']>;
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  idStatus?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Input used to create or update an order status type */
export type OrderStatusTypeInput = {
  backgroundColor?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  priority: Scalars['Int']['input'];
  state: Scalars['Int']['input'];
};

export type OrderTotals = {
  __typename?: 'OrderTotals';
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type Pagination = {
  __typename?: 'Pagination';
  currentPage?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  totalRecords?: Maybe<Scalars['Int']['output']>;
};

/** Domain Entity: PaymentMethod */
export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  createdAt?: Maybe<Scalars['String']['output']>;
  icon: Scalars['String']['output'];
  name: Scalars['String']['output'];
  payId: Scalars['ID']['output'];
  paymentPriority: Scalars['Int']['output'];
  state: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type PrintSaleTicketResponse = {
  __typename?: 'PrintSaleTicketResponse';
  data?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ProductFood = {
  __typename?: 'ProductFood';
  ExtProductFoodOptional?: Maybe<Array<Maybe<ExtProductFoodOptional>>>;
  ExtProductFoodsAll?: Maybe<Array<Maybe<ExtProductFood>>>;
  ProAssurance?: Maybe<Scalars['String']['output']>;
  ProBarCode?: Maybe<Scalars['String']['output']>;
  ProDelivery?: Maybe<Scalars['Int']['output']>;
  ProDescription?: Maybe<Scalars['String']['output']>;
  ProDescuento?: Maybe<Scalars['Float']['output']>;
  ProHeight?: Maybe<Scalars['Float']['output']>;
  ProImage?: Maybe<Scalars['String']['output']>;
  ProLength?: Maybe<Scalars['String']['output']>;
  ProOutstanding?: Maybe<Scalars['Int']['output']>;
  ProPrice?: Maybe<Scalars['Float']['output']>;
  ProProtegido?: Maybe<Scalars['Int']['output']>;
  ProQuantity?: Maybe<Scalars['Int']['output']>;
  ProStar?: Maybe<Scalars['Int']['output']>;
  ProUniDisponibles?: Maybe<Scalars['String']['output']>;
  ProVoltaje?: Maybe<Scalars['String']['output']>;
  ProWeight?: Maybe<Scalars['String']['output']>;
  ProWidth?: Maybe<Scalars['Int']['output']>;
  ValueDelivery?: Maybe<Scalars['Float']['output']>;
  area?: Maybe<Array<Maybe<Area>>>;
  cId?: Maybe<Scalars['ID']['output']>;
  caId?: Maybe<Scalars['ID']['output']>;
  carProId?: Maybe<Scalars['ID']['output']>;
  colorId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  ctId?: Maybe<Scalars['ID']['output']>;
  dId?: Maybe<Scalars['ID']['output']>;
  fId?: Maybe<Scalars['ID']['output']>;
  feat?: Maybe<Array<Maybe<Feature>>>;
  free?: Maybe<Scalars['Int']['output']>;
  getAllAvailableProduct?: Maybe<Array<Maybe<AvailableProduct>>>;
  getOneTags?: Maybe<TagsProduct>;
  getStore?: Maybe<Store>;
  idStore?: Maybe<Scalars['ID']['output']>;
  manageStock?: Maybe<Scalars['Boolean']['output']>;
  pCode?: Maybe<Scalars['String']['output']>;
  pId?: Maybe<Scalars['ID']['output']>;
  pName?: Maybe<Scalars['String']['output']>;
  pState?: Maybe<Scalars['Int']['output']>;
  product_availables?: Maybe<Array<Maybe<AvailableProduct>>>;
  sTateLogistic?: Maybe<Scalars['Int']['output']>;
  sizeId?: Maybe<Scalars['ID']['output']>;
  stock?: Maybe<Scalars['Int']['output']>;
  tgId?: Maybe<Scalars['ID']['output']>;
  tpId?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  vat?: Maybe<Scalars['Float']['output']>;
};

export type ProductFoodsResultAll = {
  __typename?: 'ProductFoodsResultAll';
  data?: Maybe<Array<Maybe<ProductFood>>>;
  message: Scalars['String']['output'];
  pagination: Pagination;
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  ExtProductFoodsAll?: Maybe<Array<Maybe<ExtProductFood>>>;
  ExtProductFoodsLogis?: Maybe<Array<Maybe<ExtProductFood>>>;
  /** Consulta todos los ExtProductFood */
  ExtProductFoodsOne?: Maybe<ExtProductFood>;
  /** Consulta todos los ExtProductFoodOptional */
  ExtProductFoodsOptionalAll?: Maybe<Array<Maybe<ExtProductFoodOptional>>>;
  ExtProductFoodsOptionalOne?: Maybe<ExtProductFoodOptional>;
  /** Consulta todos los ExtSubProductFoodOptional */
  ExtProductFoodsSubOptionalAll?: Maybe<Array<Maybe<ExtProductFoodSubOptional>>>;
  ExtProductFoodsSubOptionalOne?: Maybe<ExtProductFoodSubOptional>;
  /** Consulta todas las áreas */
  areas?: Maybe<Array<Maybe<Area>>>;
  catProducts?: Maybe<Array<Maybe<CatProducts>>>;
  catProductsAll?: Maybe<Array<Maybe<CatProducts>>>;
  catProductsLogis?: Maybe<Array<Maybe<CatProducts>>>;
  catProductsOne?: Maybe<CatProducts>;
  /** Consulta todas las ciudades de un departamento */
  cities?: Maybe<Array<Maybe<City>>>;
  /** Consulta todos los países */
  countries?: Maybe<Array<Maybe<Country>>>;
  currentNumber?: Maybe<Scalars['Int']['output']>;
  dashboardComponent?: Maybe<DashboardComponent>;
  dashboardComponents?: Maybe<Array<Maybe<DashboardComponent>>>;
  /** Consulta todos departamentos de un país */
  department?: Maybe<Array<Maybe<Department>>>;
  /** Consulta todos departamentos de un país */
  departments?: Maybe<Array<Maybe<Department>>>;
  features?: Maybe<Array<Maybe<Feature>>>;
  getAllAvailableProduct?: Maybe<Array<Maybe<AvailableProduct>>>;
  getAllCatStore?: Maybe<Array<Maybe<CatStore>>>;
  getAllCatStoreRecommended?: Maybe<Array<Maybe<CatStore>>>;
  getAllClients?: Maybe<ResponseClients>;
  getAllModules?: Maybe<Array<Maybe<Module>>>;
  getAllOrderStatusTypes?: Maybe<ResponseAllOrderStatusTypes>;
  getAllPaymentMethods?: Maybe<Array<Maybe<PaymentMethod>>>;
  getAllSalesStore?: Maybe<Array<Maybe<StoreOrders>>>;
  getAllShoppingCart?: Maybe<Array<Maybe<ShoppingCart>>>;
  getAllStore?: Maybe<Array<Maybe<Store>>>;
  getAllTags?: Maybe<ResponseAllTags>;
  getAreas?: Maybe<Array<Maybe<Area>>>;
  getCatProductsWithProduct?: Maybe<CustomTotalAndCatProductsWithProduct>;
  getCatProductsWithProductClient?: Maybe<Array<Maybe<CatProductsWithProduct>>>;
  getCities?: Maybe<Array<Maybe<City>>>;
  /** Response for find one DeviceUser */
  getDeviceUser?: Maybe<DeviceUser>;
  getDeviceUsers?: Maybe<Array<Maybe<DeviceUser>>>;
  getLocalBackendIp: Scalars['String']['output'];
  getMinPrice?: Maybe<Scalars['Float']['output']>;
  getOneCatStore?: Maybe<CatStore>;
  /** Consulta todos los países */
  getOneClients?: Maybe<Clients>;
  getOneCountry?: Maybe<Country>;
  getOneDepartment?: Maybe<Department>;
  getOneSalesStore?: Maybe<ResponseSalesStore>;
  getOneStoreSchedules?: Maybe<StoreSchedule>;
  getOneTags?: Maybe<TagsProduct>;
  getOrderStatusTypeById?: Maybe<OrderStatusType>;
  getPaymentMethod?: Maybe<PaymentMethod>;
  /** Consulta todos los productFood */
  getProductFoods?: Maybe<Array<Maybe<ProductFood>>>;
  /** Response for Role */
  getRole: Roles;
  getRoles?: Maybe<ResponseRoles>;
  getSalesAmountToday: SalesAmountTodayResponse;
  getStore?: Maybe<Store>;
  getStoreSchedules?: Maybe<Array<Maybe<StoreSchedule>>>;
  getTodaySales?: Maybe<Scalars['Int']['output']>;
  getUser?: Maybe<User>;
  getUserByEmail?: Maybe<User>;
  /** Consulta todos los catProductsos */
  getcatProducts?: Maybe<Array<Maybe<CatProducts>>>;
  module?: Maybe<Module>;
  modules?: Maybe<Array<Maybe<Module>>>;
  productFoods?: Maybe<Array<Maybe<ProductFood>>>;
  productFoodsAll?: Maybe<ProductFoodsResultAll>;
  productFoodsLogis?: Maybe<Array<Maybe<ProductFood>>>;
  productFoodsOne?: Maybe<ProductFood>;
  storeTable?: Maybe<StoreTable>;
  storeTables?: Maybe<Array<Maybe<StoreTable>>>;
  subModule?: Maybe<SubModule>;
  subModules?: Maybe<Array<Maybe<SubModule>>>;
  typeFeatures?: Maybe<Array<Maybe<TypeFeature>>>;
};


export type QueryExtProductFoodsAllArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExtProductFoodsLogisArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExtProductFoodsOneArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryExtProductFoodsOptionalAllArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExtProductFoodsOptionalOneArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryExtProductFoodsSubOptionalAllArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExtProductFoodsSubOptionalOneArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryAreasArgs = {
  aId?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  umId: Scalars['ID']['input'];
};


export type QueryCatProductsAllArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  carProId?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  desc?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  gender?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatProductsLogisArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  carProId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCatProductsOneArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  carProId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCitiesArgs = {
  dId: Scalars['ID']['input'];
};


export type QueryDashboardComponentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDepartmentsArgs = {
  cId: Scalars['ID']['input'];
};


export type QueryGetAllAvailableProductArgs = {
  pId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetAllClientsArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetAllStoreArgs = {
  StoreName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetAllTagsArgs = {
  idStore?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetCatProductsWithProductArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  carProId?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  desc?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  gender?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  productName?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetCatProductsWithProductClientArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  carProId?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  desc?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  gender?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDeviceUserArgs = {
  DeviceUserName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetMinPriceArgs = {
  idStore?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOneCatStoreArgs = {
  catStore?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOneClientsArgs = {
  cliId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOneCountryArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOneDepartmentArgs = {
  dId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOneSalesStoreArgs = {
  pCodeRef?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetOneStoreSchedulesArgs = {
  idStore?: InputMaybe<Scalars['ID']['input']>;
  schDay?: InputMaybe<Scalars['Int']['input']>;
  schState?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetOneTagsArgs = {
  idStore?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOrderStatusTypeByIdArgs = {
  idStatus: Scalars['ID']['input'];
};


export type QueryGetPaymentMethodArgs = {
  payId: Scalars['ID']['input'];
};


export type QueryGetRoleArgs = {
  idRole?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetRolesArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetStoreArgs = {
  StoreName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  idStore?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetStoreSchedulesArgs = {
  idStore?: InputMaybe<Scalars['ID']['input']>;
  schDay?: InputMaybe<Scalars['Int']['input']>;
  schState?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetUserArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryProductFoodsAllArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  desc?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  gender?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  pState?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryProductFoodsLogisArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  min?: InputMaybe<Scalars['Int']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductFoodsOneArgs = {
  cId?: InputMaybe<Scalars['ID']['input']>;
  ctId?: InputMaybe<Scalars['ID']['input']>;
  dId?: InputMaybe<Scalars['ID']['input']>;
  pId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryStoreTableArgs = {
  tableId: Scalars['ID']['input'];
};

export type RegisterBannerResponse = {
  __typename?: 'RegisterBannerResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

/** Response global */
export type Response = {
  __typename?: 'Response';
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseAllOrderStatusTypes = {
  __typename?: 'ResponseAllOrderStatusTypes';
  data?: Maybe<Array<Maybe<OrderStatusType>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** Respuesta de la petición de los clientes */
export type ResponseAllTags = {
  __typename?: 'ResponseAllTags';
  data?: Maybe<Array<Maybe<TagsProduct>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseAvailableProduct = {
  __typename?: 'ResponseAvailableProduct';
  data?: Maybe<Array<Maybe<AvailableProduct>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseCategoryProduct = {
  __typename?: 'ResponseCategoryProduct';
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** Respuesta de la petición del cliente */
export type ResponseClient = {
  __typename?: 'ResponseClient';
  data?: Maybe<Clients>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** Respuesta de la petición de los clientes */
export type ResponseClients = {
  __typename?: 'ResponseClients';
  data?: Maybe<Array<Maybe<Clients>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseDashboardComponent = {
  __typename?: 'ResponseDashboardComponent';
  data?: Maybe<DashboardComponent>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseExtProduct = {
  __typename?: 'ResponseExtProduct';
  data?: Maybe<Array<Maybe<ExtProductFood>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseExtProductFoodSubOptional = {
  __typename?: 'ResponseExtProductFoodSubOptional';
  data?: Maybe<ExtProductFoodSubOptional>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseMessageImageProduct = {
  __typename?: 'ResponseMessageImageProduct';
  data?: Maybe<IResponseData>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseOrderStatusType = {
  __typename?: 'ResponseOrderStatusType';
  data?: Maybe<OrderStatusType>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseProduct = {
  __typename?: 'ResponseProduct';
  data?: Maybe<ProductFood>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseRoles = {
  __typename?: 'ResponseRoles';
  data?: Maybe<Array<Maybe<Roles>>>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  pagination?: Maybe<Pagination>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseSalesStore = {
  __typename?: 'ResponseSalesStore';
  data?: Maybe<StoreOrders>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseScheduleStore = {
  __typename?: 'ResponseScheduleStore';
  data?: Maybe<StoreSchedule>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseShoppingCart = {
  __typename?: 'ResponseShoppingCart';
  data?: Maybe<ShoppingCart>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type ResponseUploadLogo = {
  __typename?: 'ResponseUploadLogo';
  data?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Roles = {
  __typename?: 'Roles';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  idRole?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  permissions: Scalars['JSON']['output'];
  priority?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type SalesAmountTodayResponse = {
  __typename?: 'SalesAmountTodayResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  total: Scalars['Float']['output'];
};

export type ShoppingCart = {
  __typename?: 'ShoppingCart';
  cantProducts?: Maybe<Scalars['Int']['output']>;
  comments?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  getStore?: Maybe<Store>;
  id?: Maybe<Scalars['ID']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  idUser?: Maybe<Scalars['ID']['output']>;
  pId?: Maybe<Scalars['ID']['output']>;
  priceProduct?: Maybe<Scalars['Float']['output']>;
  products?: Maybe<ProductFood>;
  refCodePid?: Maybe<Scalars['String']['output']>;
  sState?: Maybe<Scalars['Int']['output']>;
  shoppingCartId?: Maybe<Scalars['ID']['output']>;
  shoppingCartRefCode?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Store = {
  __typename?: 'Store';
  Image?: Maybe<Scalars['String']['output']>;
  ImageName?: Maybe<Scalars['String']['output']>;
  NitStore?: Maybe<Scalars['String']['output']>;
  ULocation?: Maybe<Scalars['String']['output']>;
  Viaprincipal?: Maybe<Scalars['String']['output']>;
  addressStore?: Maybe<Scalars['String']['output']>;
  banner?: Maybe<Scalars['String']['output']>;
  cId?: Maybe<Scalars['ID']['output']>;
  catStore?: Maybe<Scalars['ID']['output']>;
  cateStore?: Maybe<CatStore>;
  city?: Maybe<City>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  ctId?: Maybe<Scalars['ID']['output']>;
  dId?: Maybe<Scalars['ID']['output']>;
  dailyGoal?: Maybe<Scalars['Float']['output']>;
  deliveryTimeMinutes?: Maybe<Scalars['Int']['output']>;
  department?: Maybe<Department>;
  description?: Maybe<Scalars['String']['output']>;
  documentIdentifier?: Maybe<Scalars['String']['output']>;
  emailStore?: Maybe<Scalars['String']['output']>;
  getStoreSchedules?: Maybe<Array<Maybe<StoreSchedule>>>;
  id?: Maybe<Scalars['ID']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  neighborhoodStore?: Maybe<Scalars['String']['output']>;
  open?: Maybe<Scalars['Int']['output']>;
  pais?: Maybe<Country>;
  scheduleOpenAll?: Maybe<Scalars['Boolean']['output']>;
  secVia?: Maybe<Scalars['String']['output']>;
  siteWeb?: Maybe<Scalars['String']['output']>;
  socialRaz?: Maybe<Scalars['String']['output']>;
  storeName?: Maybe<Scalars['String']['output']>;
  storeOwner?: Maybe<Scalars['String']['output']>;
  storePhone?: Maybe<Scalars['String']['output']>;
  typeContribute?: Maybe<Scalars['String']['output']>;
  typeRegiments?: Maybe<Scalars['String']['output']>;
  uPhoNum?: Maybe<Scalars['String']['output']>;
  uState?: Maybe<Scalars['String']['output']>;
  upLat?: Maybe<Scalars['String']['output']>;
  upLon?: Maybe<Scalars['String']['output']>;
};

export type StoreOrders = {
  __typename?: 'StoreOrders';
  change?: Maybe<Scalars['Int']['output']>;
  channel?: Maybe<Scalars['Int']['output']>;
  client?: Maybe<Clients>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  getOneStore?: Maybe<Store>;
  getUser?: Maybe<User>;
  id?: Maybe<Scalars['ID']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  locationUser?: Maybe<Scalars['String']['output']>;
  pCodeRef?: Maybe<Scalars['String']['output']>;
  pSState?: Maybe<Scalars['ID']['output']>;
  payId?: Maybe<Scalars['ID']['output']>;
  paymentMethod?: Maybe<PaymentMethod>;
  pdpId?: Maybe<Scalars['ID']['output']>;
  ppState?: Maybe<Scalars['Int']['output']>;
  shoppingCartRefCode?: Maybe<Scalars['String']['output']>;
  shoppingCarts?: Maybe<Array<Maybe<ShoppingCart>>>;
  status?: Maybe<Scalars['String']['output']>;
  statusOrder?: Maybe<OrderStatusType>;
  store?: Maybe<Store>;
  totalProductsPrice?: Maybe<Scalars['Float']['output']>;
  totals?: Maybe<Array<Maybe<OrderTotals>>>;
  unidProducts?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type StoreSchedule = {
  __typename?: 'StoreSchedule';
  id?: Maybe<Scalars['ID']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  schDay?: Maybe<Scalars['Int']['output']>;
  schHoEnd?: Maybe<Scalars['String']['output']>;
  schHoSta?: Maybe<Scalars['String']['output']>;
  schId?: Maybe<Scalars['ID']['output']>;
  schState?: Maybe<Scalars['Int']['output']>;
  store?: Maybe<Store>;
};

export type StoreTable = {
  __typename?: 'StoreTable';
  createdAt: Scalars['DateTime']['output'];
  seats?: Maybe<Scalars['Int']['output']>;
  section?: Maybe<Scalars['String']['output']>;
  tableId: Scalars['ID']['output'];
  tableName: Scalars['String']['output'];
  tableState?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type SubModule = {
  __typename?: 'SubModule';
  smIcon?: Maybe<Scalars['String']['output']>;
  smId?: Maybe<Scalars['ID']['output']>;
  smName?: Maybe<Scalars['String']['output']>;
  smPath?: Maybe<Scalars['String']['output']>;
  smState?: Maybe<Scalars['Int']['output']>;
  view?: Maybe<Scalars['String']['output']>;
};

export type SubModuleInput = {
  smId?: InputMaybe<Scalars['ID']['input']>;
  smName?: InputMaybe<Scalars['String']['input']>;
  smPath?: InputMaybe<Scalars['String']['input']>;
  smState?: InputMaybe<Scalars['Int']['input']>;
};

export type SubModuleInputLineItem = {
  smId?: InputMaybe<Scalars['ID']['input']>;
  smName?: InputMaybe<Scalars['String']['input']>;
  smPath?: InputMaybe<Scalars['String']['input']>;
  smState?: InputMaybe<Scalars['Int']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  messageCreated?: Maybe<User>;
  newStore?: Maybe<Store>;
  numberIncremented?: Maybe<Scalars['Int']['output']>;
};


export type SubscriptionMessageCreatedArgs = {
  chatId: Scalars['ID']['input'];
};

export type TableResponse = {
  __typename?: 'TableResponse';
  data?: Maybe<StoreTable>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type TagsProduct = {
  __typename?: 'TagsProduct';
  aName?: Maybe<Scalars['String']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  idUser?: Maybe<Scalars['ID']['output']>;
  nameTag?: Maybe<Scalars['String']['output']>;
  pId?: Maybe<Scalars['ID']['output']>;
  state?: Maybe<Scalars['Int']['output']>;
  tgId?: Maybe<Scalars['ID']['output']>;
};

export type TypeFeature = {
  __typename?: 'TypeFeature';
  thpDatCre?: Maybe<Scalars['String']['output']>;
  thpDatMod?: Maybe<Scalars['String']['output']>;
  thpIcon?: Maybe<Scalars['String']['output']>;
  thpId: Scalars['ID']['output'];
  thpName?: Maybe<Scalars['String']['output']>;
  thpState?: Maybe<Scalars['String']['output']>;
};

export type UpdateModuleOrderInput = {
  mId: Scalars['ID']['input'];
  mPriority?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateModuleOrderPayload = {
  __typename?: 'UpdateModuleOrderPayload';
  errors?: Maybe<Array<Maybe<Errors>>>;
  message: Scalars['String']['output'];
  modules?: Maybe<Array<Maybe<Module>>>;
  success: Scalars['Boolean']['output'];
};

/** Input used to update an existing order status type */
export type UpdateOrderStatusTypeInput = {
  backgroundColor?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  idStatus: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePaymentMethodInput = {
  icon?: InputMaybe<Scalars['String']['input']>;
  mIcon?: InputMaybe<Scalars['Int']['input']>;
  mState?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  paymentPriority?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleResponse = {
  __typename?: 'UpdateRoleResponse';
  data?: Maybe<Roles>;
  errors?: Maybe<Array<Maybe<Errors>>>;
  message?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type User = {
  __typename?: 'User';
  ULocation?: Maybe<Scalars['String']['output']>;
  associateStore?: Maybe<Scalars['JSON']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  idRole?: Maybe<Scalars['ID']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Roles>;
  siteWeb?: Maybe<Scalars['String']['output']>;
  uPhoNum?: Maybe<Scalars['String']['output']>;
  uState?: Maybe<Scalars['String']['output']>;
  uToken?: Maybe<Scalars['String']['output']>;
  upIdeDoc?: Maybe<Scalars['String']['output']>;
  upLat?: Maybe<Scalars['String']['output']>;
  upLon?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type CatProducts = {
  __typename?: 'catProducts';
  ProDescription?: Maybe<Scalars['String']['output']>;
  ProImage?: Maybe<Scalars['String']['output']>;
  carProId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  pName?: Maybe<Scalars['String']['output']>;
  pState?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CatProductsWithProduct = {
  __typename?: 'catProductsWithProduct';
  ProDescription?: Maybe<Scalars['String']['output']>;
  ProImage?: Maybe<Scalars['String']['output']>;
  carProId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  idStore?: Maybe<Scalars['ID']['output']>;
  pName?: Maybe<Scalars['String']['output']>;
  pState?: Maybe<Scalars['Int']['output']>;
  productFoodsAll?: Maybe<Array<Maybe<ProductFood>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Context error */
export type ContextError = {
  __typename?: 'contextError';
  key?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  limit?: Maybe<Scalars['Int']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export type CustomTotalAndCatProductsWithProduct = {
  __typename?: 'customTotalAndCatProductsWithProduct';
  catProductsWithProduct?: Maybe<Array<Maybe<CatProductsWithProduct>>>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

/** Errors */
export type Errors = {
  __typename?: 'errors';
  context?: Maybe<ContextError>;
  message?: Maybe<Scalars['String']['output']>;
  path?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  type?: Maybe<Scalars['String']['output']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Area: ResolverTypeWrapper<Area>;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  AvailableProduct: ResolverTypeWrapper<AvailableProduct>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CatStore: ResolverTypeWrapper<CatStore>;
  City: ResolverTypeWrapper<City>;
  Clients: ResolverTypeWrapper<Clients>;
  Country: ResolverTypeWrapper<Country>;
  CreatePaymentMethodInput: CreatePaymentMethodInput;
  CreateRoleResponse: ResolverTypeWrapper<CreateRoleResponse>;
  CreateUserInput: CreateUserInput;
  DashboardComponent: ResolverTypeWrapper<DashboardComponent>;
  DashboardComponentInput: DashboardComponentInput;
  DashboardComponentUpdateInput: DashboardComponentUpdateInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Department: ResolverTypeWrapper<Department>;
  DeviceUser: ResolverTypeWrapper<DeviceUser>;
  DeviceUserInput: DeviceUserInput;
  DeviceUserResponse: ResolverTypeWrapper<DeviceUserResponse>;
  EditExtProductFoodOptionalInput: EditExtProductFoodOptionalInput;
  EditExtProductFoodSubOptionalInput: EditExtProductFoodSubOptionalInput;
  ExtProductFood: ResolverTypeWrapper<ExtProductFood>;
  ExtProductFoodInput: ExtProductFoodInput;
  ExtProductFoodOptional: ResolverTypeWrapper<ExtProductFoodOptional>;
  ExtProductFoodOptionalInput: ExtProductFoodOptionalInput;
  ExtProductFoodSubOptional: ResolverTypeWrapper<ExtProductFoodSubOptional>;
  ExtProductFoodSubOptionalInput: ExtProductFoodSubOptionalInput;
  Feature: ResolverTypeWrapper<Feature>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  IArea: IArea;
  IAvailableProduct: IAvailableProduct;
  IBanner: IBanner;
  ICatStore: ICatStore;
  ICategories: ICategories;
  ICity: ICity;
  IClients: IClients;
  ICountry: ICountry;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IDeleteCountries: IDeleteCountries;
  IDeleteProductFood: IDeleteProductFood;
  IDepartment: IDepartment;
  IEditCountries: IEditCountries;
  IEditDepartments: IEditDepartments;
  IEditMunicipalities: IEditMunicipalities;
  IFeature: IFeature;
  IFileImageProductFood: IFileImageProductFood;
  IID_SUB: Iid_Sub;
  IID_SUB_ITEMS: Iid_Sub_Items;
  ILineItemsExtraFinal: ILineItemsExtraFinal;
  ILineItemsIds: ILineItemsIds;
  IParamsPriority: IParamsPriority;
  IResponseData: ResolverTypeWrapper<IResponseData>;
  IResponseMultipleTag: ResolverTypeWrapper<IResponseMultipleTag>;
  IResponseTag: ResolverTypeWrapper<IResponseTag>;
  IRole: IRole;
  IShoppingCart: IShoppingCart;
  IStore: IStore;
  ITag: ITag;
  ITstoreSchedule: ITstoreSchedule;
  ITypeFeature: ITypeFeature;
  InputCatProducts: InputCatProducts;
  InputExtProductFood: InputExtProductFood;
  InputExtProductFoodOptional: InputExtProductFoodOptional;
  InputExtProductFoodSubOptional: InputExtProductFoodSubOptional;
  InputProductFood: InputProductFood;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IsStoreSchedule: IsStoreSchedule;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  LineItemsIdPro: LineItemsIdPro;
  Module: ResolverTypeWrapper<Module>;
  ModuleInput: ModuleInput;
  ModuleInputLineItem: ModuleInputLineItem;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  OrderPapu: ResolverTypeWrapper<OrderPapu>;
  OrderStatusPriorityInput: OrderStatusPriorityInput;
  OrderStatusResponse: ResolverTypeWrapper<OrderStatusResponse>;
  OrderStatusType: ResolverTypeWrapper<OrderStatusType>;
  OrderStatusTypeInput: OrderStatusTypeInput;
  OrderTotals: ResolverTypeWrapper<OrderTotals>;
  Pagination: ResolverTypeWrapper<Pagination>;
  PaymentMethod: ResolverTypeWrapper<PaymentMethod>;
  PrintSaleTicketResponse: ResolverTypeWrapper<PrintSaleTicketResponse>;
  ProductFood: ResolverTypeWrapper<ProductFood>;
  ProductFoodsResultAll: ResolverTypeWrapper<ProductFoodsResultAll>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RegisterBannerResponse: ResolverTypeWrapper<RegisterBannerResponse>;
  Response: ResolverTypeWrapper<Response>;
  ResponseAllOrderStatusTypes: ResolverTypeWrapper<ResponseAllOrderStatusTypes>;
  ResponseAllTags: ResolverTypeWrapper<ResponseAllTags>;
  ResponseAvailableProduct: ResolverTypeWrapper<ResponseAvailableProduct>;
  ResponseCategoryProduct: ResolverTypeWrapper<ResponseCategoryProduct>;
  ResponseClient: ResolverTypeWrapper<ResponseClient>;
  ResponseClients: ResolverTypeWrapper<ResponseClients>;
  ResponseDashboardComponent: ResolverTypeWrapper<ResponseDashboardComponent>;
  ResponseExtProduct: ResolverTypeWrapper<ResponseExtProduct>;
  ResponseExtProductFoodSubOptional: ResolverTypeWrapper<ResponseExtProductFoodSubOptional>;
  ResponseMessageImageProduct: ResolverTypeWrapper<ResponseMessageImageProduct>;
  ResponseOrderStatusType: ResolverTypeWrapper<ResponseOrderStatusType>;
  ResponseProduct: ResolverTypeWrapper<ResponseProduct>;
  ResponseRoles: ResolverTypeWrapper<ResponseRoles>;
  ResponseSalesStore: ResolverTypeWrapper<ResponseSalesStore>;
  ResponseScheduleStore: ResolverTypeWrapper<ResponseScheduleStore>;
  ResponseShoppingCart: ResolverTypeWrapper<ResponseShoppingCart>;
  ResponseUploadLogo: ResolverTypeWrapper<ResponseUploadLogo>;
  Roles: ResolverTypeWrapper<Roles>;
  SalesAmountTodayResponse: ResolverTypeWrapper<SalesAmountTodayResponse>;
  ShoppingCart: ResolverTypeWrapper<ShoppingCart>;
  Store: ResolverTypeWrapper<Store>;
  StoreOrders: ResolverTypeWrapper<StoreOrders>;
  StoreSchedule: ResolverTypeWrapper<StoreSchedule>;
  StoreTable: ResolverTypeWrapper<StoreTable>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SubModule: ResolverTypeWrapper<SubModule>;
  SubModuleInput: SubModuleInput;
  SubModuleInputLineItem: SubModuleInputLineItem;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  TableResponse: ResolverTypeWrapper<TableResponse>;
  TagsProduct: ResolverTypeWrapper<TagsProduct>;
  TypeFeature: ResolverTypeWrapper<TypeFeature>;
  UpdateModuleOrderInput: UpdateModuleOrderInput;
  UpdateModuleOrderPayload: ResolverTypeWrapper<UpdateModuleOrderPayload>;
  UpdateOrderStatusTypeInput: UpdateOrderStatusTypeInput;
  UpdatePaymentMethodInput: UpdatePaymentMethodInput;
  UpdateRoleResponse: ResolverTypeWrapper<UpdateRoleResponse>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<User>;
  catProducts: ResolverTypeWrapper<CatProducts>;
  catProductsWithProduct: ResolverTypeWrapper<CatProductsWithProduct>;
  contextError: ResolverTypeWrapper<ContextError>;
  customTotalAndCatProductsWithProduct: ResolverTypeWrapper<CustomTotalAndCatProductsWithProduct>;
  errors: ResolverTypeWrapper<Errors>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Area: Area;
  AuthPayload: AuthPayload;
  AvailableProduct: AvailableProduct;
  Boolean: Scalars['Boolean']['output'];
  CatStore: CatStore;
  City: City;
  Clients: Clients;
  Country: Country;
  CreatePaymentMethodInput: CreatePaymentMethodInput;
  CreateRoleResponse: CreateRoleResponse;
  CreateUserInput: CreateUserInput;
  DashboardComponent: DashboardComponent;
  DashboardComponentInput: DashboardComponentInput;
  DashboardComponentUpdateInput: DashboardComponentUpdateInput;
  DateTime: Scalars['DateTime']['output'];
  Department: Department;
  DeviceUser: DeviceUser;
  DeviceUserInput: DeviceUserInput;
  DeviceUserResponse: DeviceUserResponse;
  EditExtProductFoodOptionalInput: EditExtProductFoodOptionalInput;
  EditExtProductFoodSubOptionalInput: EditExtProductFoodSubOptionalInput;
  ExtProductFood: ExtProductFood;
  ExtProductFoodInput: ExtProductFoodInput;
  ExtProductFoodOptional: ExtProductFoodOptional;
  ExtProductFoodOptionalInput: ExtProductFoodOptionalInput;
  ExtProductFoodSubOptional: ExtProductFoodSubOptional;
  ExtProductFoodSubOptionalInput: ExtProductFoodSubOptionalInput;
  Feature: Feature;
  Float: Scalars['Float']['output'];
  IArea: IArea;
  IAvailableProduct: IAvailableProduct;
  IBanner: IBanner;
  ICatStore: ICatStore;
  ICategories: ICategories;
  ICity: ICity;
  IClients: IClients;
  ICountry: ICountry;
  ID: Scalars['ID']['output'];
  IDeleteCountries: IDeleteCountries;
  IDeleteProductFood: IDeleteProductFood;
  IDepartment: IDepartment;
  IEditCountries: IEditCountries;
  IEditDepartments: IEditDepartments;
  IEditMunicipalities: IEditMunicipalities;
  IFeature: IFeature;
  IFileImageProductFood: IFileImageProductFood;
  IID_SUB: Iid_Sub;
  IID_SUB_ITEMS: Iid_Sub_Items;
  ILineItemsExtraFinal: ILineItemsExtraFinal;
  ILineItemsIds: ILineItemsIds;
  IParamsPriority: IParamsPriority;
  IResponseData: IResponseData;
  IResponseMultipleTag: IResponseMultipleTag;
  IResponseTag: IResponseTag;
  IRole: IRole;
  IShoppingCart: IShoppingCart;
  IStore: IStore;
  ITag: ITag;
  ITstoreSchedule: ITstoreSchedule;
  ITypeFeature: ITypeFeature;
  InputCatProducts: InputCatProducts;
  InputExtProductFood: InputExtProductFood;
  InputExtProductFoodOptional: InputExtProductFoodOptional;
  InputExtProductFoodSubOptional: InputExtProductFoodSubOptional;
  InputProductFood: InputProductFood;
  Int: Scalars['Int']['output'];
  IsStoreSchedule: IsStoreSchedule;
  JSON: Scalars['JSON']['output'];
  LineItemsIdPro: LineItemsIdPro;
  Module: Module;
  ModuleInput: ModuleInput;
  ModuleInputLineItem: ModuleInputLineItem;
  Mutation: Record<PropertyKey, never>;
  OrderPapu: OrderPapu;
  OrderStatusPriorityInput: OrderStatusPriorityInput;
  OrderStatusResponse: OrderStatusResponse;
  OrderStatusType: OrderStatusType;
  OrderStatusTypeInput: OrderStatusTypeInput;
  OrderTotals: OrderTotals;
  Pagination: Pagination;
  PaymentMethod: PaymentMethod;
  PrintSaleTicketResponse: PrintSaleTicketResponse;
  ProductFood: ProductFood;
  ProductFoodsResultAll: ProductFoodsResultAll;
  Query: Record<PropertyKey, never>;
  RegisterBannerResponse: RegisterBannerResponse;
  Response: Response;
  ResponseAllOrderStatusTypes: ResponseAllOrderStatusTypes;
  ResponseAllTags: ResponseAllTags;
  ResponseAvailableProduct: ResponseAvailableProduct;
  ResponseCategoryProduct: ResponseCategoryProduct;
  ResponseClient: ResponseClient;
  ResponseClients: ResponseClients;
  ResponseDashboardComponent: ResponseDashboardComponent;
  ResponseExtProduct: ResponseExtProduct;
  ResponseExtProductFoodSubOptional: ResponseExtProductFoodSubOptional;
  ResponseMessageImageProduct: ResponseMessageImageProduct;
  ResponseOrderStatusType: ResponseOrderStatusType;
  ResponseProduct: ResponseProduct;
  ResponseRoles: ResponseRoles;
  ResponseSalesStore: ResponseSalesStore;
  ResponseScheduleStore: ResponseScheduleStore;
  ResponseShoppingCart: ResponseShoppingCart;
  ResponseUploadLogo: ResponseUploadLogo;
  Roles: Roles;
  SalesAmountTodayResponse: SalesAmountTodayResponse;
  ShoppingCart: ShoppingCart;
  Store: Store;
  StoreOrders: StoreOrders;
  StoreSchedule: StoreSchedule;
  StoreTable: StoreTable;
  String: Scalars['String']['output'];
  SubModule: SubModule;
  SubModuleInput: SubModuleInput;
  SubModuleInputLineItem: SubModuleInputLineItem;
  Subscription: Record<PropertyKey, never>;
  TableResponse: TableResponse;
  TagsProduct: TagsProduct;
  TypeFeature: TypeFeature;
  UpdateModuleOrderInput: UpdateModuleOrderInput;
  UpdateModuleOrderPayload: UpdateModuleOrderPayload;
  UpdateOrderStatusTypeInput: UpdateOrderStatusTypeInput;
  UpdatePaymentMethodInput: UpdatePaymentMethodInput;
  UpdateRoleResponse: UpdateRoleResponse;
  Upload: Scalars['Upload']['output'];
  User: User;
  catProducts: CatProducts;
  catProductsWithProduct: CatProductsWithProduct;
  contextError: ContextError;
  customTotalAndCatProductsWithProduct: CustomTotalAndCatProductsWithProduct;
  errors: Errors;
};

export type AreaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Area'] = ResolversParentTypes['Area']> = {
  aDatCre?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  aDatMod?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  aId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  aName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  aState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type AuthPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = {
  admin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isVerifyEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  newRefreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  storeUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type AvailableProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['AvailableProduct'] = ResolversParentTypes['AvailableProduct']> = {
  availableProductId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dayAvailable?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type CatStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['CatStore'] = ResolversParentTypes['CatStore']> = {
  cName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cPathImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  catStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  csDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getAllStore?: Resolver<Maybe<Array<Maybe<ResolversTypes['Store']>>>, ParentType, ContextType>;
  idUser?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type CityResolvers<ContextType = any, ParentType extends ResolversParentTypes['City'] = ResolversParentTypes['City']> = {
  cDatCre?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  cDatMod?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  cName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ctId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  dId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type ClientsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Clients'] = ResolversParentTypes['Clients']> = {
  ClientAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ccClient?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  cliId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  clientLastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clientName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  clientNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idUser?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updateAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type CountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  cCalCod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cDatCre?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  cDatMod?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  cId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  cName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type CreateRoleResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoleResponse'] = ResolversParentTypes['CreateRoleResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['Roles']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type DashboardComponentResolvers<ContextType = any, ParentType extends ResolversParentTypes['DashboardComponent'] = ResolversParentTypes['DashboardComponent']> = {
  coordinates?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  createAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idUser?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updateAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DepartmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Department'] = ResolversParentTypes['Department']> = {
  cId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  code_dId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dDatCre?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dDatMod?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  dName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type DeviceUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeviceUser'] = ResolversParentTypes['DeviceUser']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  dId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  dState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  deviceId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deviceName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  family?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  ip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isBot?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  locationFormat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  model?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  os?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  platform?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type DeviceUserResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeviceUserResponse'] = ResolversParentTypes['DeviceUserResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['DeviceUser']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ExtProductFoodResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExtProductFood'] = ResolversParentTypes['ExtProductFood']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  exPid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  exState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  extraName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  extraPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  newExtraPrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type ExtProductFoodOptionalResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExtProductFoodOptional'] = ResolversParentTypes['ExtProductFoodOptional']> = {
  ExtProductFoodsSubOptionalAll?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFoodSubOptional']>>>, ParentType, ContextType>;
  OptionalProName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  numbersOptionalOnly?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  opExPid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type ExtProductFoodSubOptionalResolvers<ContextType = any, ParentType extends ResolversParentTypes['ExtProductFoodSubOptional'] = ResolversParentTypes['ExtProductFoodSubOptional']> = {
  OptionalSubProName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  exCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  exCodeOptionExtra?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  opExPid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  opSubExPid?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type FeatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['Feature'] = ResolversParentTypes['Feature']> = {
  fId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  hpqrDatCre?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hpqrDatMod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hpqrQuestion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hpqrState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thpId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  typeFeature?: Resolver<Maybe<ResolversTypes['TypeFeature']>, ParentType, ContextType>;
};

export type IResponseDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['IResponseData'] = ResolversParentTypes['IResponseData']> = {
  ProImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type IResponseMultipleTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['IResponseMultipleTag'] = ResolversParentTypes['IResponseMultipleTag']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['TagsProduct']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type IResponseTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['IResponseTag'] = ResolversParentTypes['IResponseTag']> = {
  data?: Resolver<Maybe<ResolversTypes['TagsProduct']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type ModuleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Module'] = ResolversParentTypes['Module']> = {
  mIcon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  mName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mPriority?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  subModules?: Resolver<Maybe<Array<Maybe<ResolversTypes['SubModule']>>>, ParentType, ContextType>;
  view?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  DeleteExtFoodSubsOptional?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationDeleteExtFoodSubsOptionalArgs>>;
  DeleteExtProductFoodsOptional?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationDeleteExtProductFoodsOptionalArgs>>;
  EditTags?: Resolver<Maybe<ResolversTypes['TagsProduct']>, ParentType, ContextType, Partial<MutationEditTagsArgs>>;
  createArea?: Resolver<Maybe<ResolversTypes['Area']>, ParentType, ContextType, RequireFields<MutationCreateAreaArgs, 'input'>>;
  createCity?: Resolver<Maybe<ResolversTypes['City']>, ParentType, ContextType, Partial<MutationCreateCityArgs>>;
  createClients?: Resolver<Maybe<ResolversTypes['ResponseClient']>, ParentType, ContextType, Partial<MutationCreateClientsArgs>>;
  createCountry?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, Partial<MutationCreateCountryArgs>>;
  createDashboardComponent?: Resolver<ResolversTypes['ResponseDashboardComponent'], ParentType, ContextType, RequireFields<MutationCreateDashboardComponentArgs, 'input'>>;
  createDepartments?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType, Partial<MutationCreateDepartmentsArgs>>;
  createFeature?: Resolver<Maybe<ResolversTypes['Feature']>, ParentType, ContextType, Partial<MutationCreateFeatureArgs>>;
  createFeatureType?: Resolver<Maybe<ResolversTypes['TypeFeature']>, ParentType, ContextType, Partial<MutationCreateFeatureTypeArgs>>;
  createModule?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationCreateModuleArgs>>;
  createOrder?: Resolver<Maybe<ResolversTypes['OrderPapu']>, ParentType, ContextType, RequireFields<MutationCreateOrderArgs, 'id' | 'idStore' | 'pdpId' | 'totalProductsPrice' | 'unidProducts'>>;
  createOrderStatusType?: Resolver<ResolversTypes['ResponseOrderStatusType'], ParentType, ContextType, RequireFields<MutationCreateOrderStatusTypeArgs, 'data'>>;
  createPaymentMethod?: Resolver<ResolversTypes['PaymentMethod'], ParentType, ContextType, RequireFields<MutationCreatePaymentMethodArgs, 'input'>>;
  createRoleMutation?: Resolver<Maybe<ResolversTypes['CreateRoleResponse']>, ParentType, ContextType, Partial<MutationCreateRoleMutationArgs>>;
  createSubModule?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationCreateSubModuleArgs>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteALogoStore?: Resolver<Maybe<ResolversTypes['ResponseUploadLogo']>, ParentType, ContextType, Partial<MutationDeleteALogoStoreArgs>>;
  deleteCatFinalOfProducts?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, Partial<MutationDeleteCatFinalOfProductsArgs>>;
  deleteCatOfProducts?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationDeleteCatOfProductsArgs, 'idPc'>>;
  deleteClient?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationDeleteClientArgs, 'clState'>>;
  deleteCountries?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<MutationDeleteCountriesArgs, 'input'>>;
  deleteDashboardComponent?: Resolver<ResolversTypes['ResponseDashboardComponent'], ParentType, ContextType, RequireFields<MutationDeleteDashboardComponentArgs, 'id'>>;
  deleteExtraProduct?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationDeleteExtraProductArgs>>;
  deleteModule?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationDeleteModuleArgs>>;
  deleteOneBanner?: Resolver<ResolversTypes['RegisterBannerResponse'], ParentType, ContextType, Partial<MutationDeleteOneBannerArgs>>;
  deleteOneItem?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationDeleteOneItemArgs>>;
  deleteOneModule?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationDeleteOneModuleArgs>>;
  deleteOneTag?: Resolver<Maybe<ResolversTypes['IResponseTag']>, ParentType, ContextType, Partial<MutationDeleteOneTagArgs>>;
  deleteOrderStatusType?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteOrderStatusTypeArgs, 'idStatus'>>;
  deletePaymentMethod?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeletePaymentMethodArgs, 'payId'>>;
  deleteProductFoods?: Resolver<Maybe<ResolversTypes['ProductFood']>, ParentType, ContextType, Partial<MutationDeleteProductFoodsArgs>>;
  deleteSubModule?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationDeleteSubModuleArgs>>;
  desCategoryStore?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationDesCategoryStoreArgs>>;
  editAvailableProduct?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationEditAvailableProductArgs>>;
  editCountries?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<MutationEditCountriesArgs, 'input'>>;
  editDepartments?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType, RequireFields<MutationEditDepartmentsArgs, 'input'>>;
  editExtFoodSubsOptional?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationEditExtFoodSubsOptionalArgs>>;
  editExtProductFoodOptional?: Resolver<Maybe<ResolversTypes['ExtProductFoodOptional']>, ParentType, ContextType, RequireFields<MutationEditExtProductFoodOptionalArgs, 'input'>>;
  editExtProductFoods?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationEditExtProductFoodsArgs, 'input'>>;
  editExtraProductFoods?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationEditExtraProductFoodsArgs>>;
  editModule?: Resolver<Maybe<ResolversTypes['Module']>, ParentType, ContextType, Partial<MutationEditModuleArgs>>;
  editMunicipalities?: Resolver<Maybe<ResolversTypes['City']>, ParentType, ContextType, RequireFields<MutationEditMunicipalitiesArgs, 'input'>>;
  editOneCategoryProduct?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationEditOneCategoryProductArgs, 'carProId' | 'pName'>>;
  editOneClient?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationEditOneClientArgs>>;
  editProductFoods?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationEditProductFoodsArgs>>;
  loginUser?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationLoginUserArgs, 'uEmail' | 'uPassword'>>;
  newRegisterDeviceUser?: Resolver<Maybe<ResolversTypes['DeviceUserResponse']>, ParentType, ContextType, Partial<MutationNewRegisterDeviceUserArgs>>;
  newRegisterStore?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, Partial<MutationNewRegisterStoreArgs>>;
  printSaleTicket?: Resolver<ResolversTypes['PrintSaleTicketResponse'], ParentType, ContextType, RequireFields<MutationPrintSaleTicketArgs, 'saleId'>>;
  registerAvailableProduct?: Resolver<Maybe<ResolversTypes['ResponseAvailableProduct']>, ParentType, ContextType, Partial<MutationRegisterAvailableProductArgs>>;
  registerBanner?: Resolver<ResolversTypes['RegisterBannerResponse'], ParentType, ContextType, Partial<MutationRegisterBannerArgs>>;
  registerCategoryStore?: Resolver<Maybe<ResolversTypes['CatStore']>, ParentType, ContextType, Partial<MutationRegisterCategoryStoreArgs>>;
  registerLogo?: Resolver<Maybe<ResolversTypes['ResponseUploadLogo']>, ParentType, ContextType, Partial<MutationRegisterLogoArgs>>;
  registerModule?: Resolver<Maybe<ResolversTypes['Module']>, ParentType, ContextType, Partial<MutationRegisterModuleArgs>>;
  registerMultipleTags?: Resolver<Maybe<ResolversTypes['IResponseMultipleTag']>, ParentType, ContextType, RequireFields<MutationRegisterMultipleTagsArgs, 'input'>>;
  registerSalesStore?: Resolver<Maybe<ResolversTypes['ResponseSalesStore']>, ParentType, ContextType, Partial<MutationRegisterSalesStoreArgs>>;
  registerShoppingCart?: Resolver<Maybe<ResolversTypes['ResponseShoppingCart']>, ParentType, ContextType, Partial<MutationRegisterShoppingCartArgs>>;
  registerTag?: Resolver<Maybe<ResolversTypes['IResponseTag']>, ParentType, ContextType, Partial<MutationRegisterTagArgs>>;
  registerTagName?: Resolver<Maybe<ResolversTypes['IResponseTag']>, ParentType, ContextType, Partial<MutationRegisterTagNameArgs>>;
  registerUser?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationRegisterUserArgs, 'email' | 'name' | 'password'>>;
  removeRoles?: Resolver<Maybe<ResolversTypes['UpdateRoleResponse']>, ParentType, ContextType, RequireFields<MutationRemoveRolesArgs, 'roleIds'>>;
  setImageProducts?: Resolver<Maybe<ResolversTypes['ResponseMessageImageProduct']>, ParentType, ContextType, Partial<MutationSetImageProductsArgs>>;
  setScheduleOpenAll?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, RequireFields<MutationSetScheduleOpenAllArgs, 'scheduleOpenAll'>>;
  setStoreSchedule?: Resolver<Maybe<ResolversTypes['ResponseScheduleStore']>, ParentType, ContextType, RequireFields<MutationSetStoreScheduleArgs, 'input'>>;
  setStoreScheduleReserve?: Resolver<Maybe<Array<Maybe<ResolversTypes['StoreSchedule']>>>, ParentType, ContextType, RequireFields<MutationSetStoreScheduleReserveArgs, 'input'>>;
  storeTable?: Resolver<Maybe<ResolversTypes['TableResponse']>, ParentType, ContextType, RequireFields<MutationStoreTableArgs, 'tableName'>>;
  storeTableCreate?: Resolver<Maybe<ResolversTypes['TableResponse']>, ParentType, ContextType, RequireFields<MutationStoreTableCreateArgs, 'tableName'>>;
  updateDashboardComponent?: Resolver<Maybe<ResolversTypes['ResponseDashboardComponent']>, ParentType, ContextType, Partial<MutationUpdateDashboardComponentArgs>>;
  updateExtProductFoods?: Resolver<Maybe<ResolversTypes['ExtProductFood']>, ParentType, ContextType, Partial<MutationUpdateExtProductFoodsArgs>>;
  updateExtProductOptional?: Resolver<Maybe<ResolversTypes['Response']>, ParentType, ContextType, Partial<MutationUpdateExtProductOptionalArgs>>;
  updateExtProductSubOptional?: Resolver<Maybe<ResolversTypes['ResponseExtProductFoodSubOptional']>, ParentType, ContextType, Partial<MutationUpdateExtProductSubOptionalArgs>>;
  updateModuleOrder?: Resolver<Maybe<ResolversTypes['UpdateModuleOrderPayload']>, ParentType, ContextType, RequireFields<MutationUpdateModuleOrderArgs, 'input'>>;
  updateMultipleExtProduct?: Resolver<Maybe<ResolversTypes['ResponseExtProduct']>, ParentType, ContextType, Partial<MutationUpdateMultipleExtProductArgs>>;
  updateMultipleProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['ResponseProduct']>>>, ParentType, ContextType, Partial<MutationUpdateMultipleProductsArgs>>;
  updateOrderStatusPriorities?: Resolver<Maybe<ResolversTypes['OrderStatusResponse']>, ParentType, ContextType, RequireFields<MutationUpdateOrderStatusPrioritiesArgs, 'data'>>;
  updateOrderStatusType?: Resolver<ResolversTypes['OrderStatusType'], ParentType, ContextType, RequireFields<MutationUpdateOrderStatusTypeArgs, 'data'>>;
  updatePaymentMethod?: Resolver<ResolversTypes['PaymentMethod'], ParentType, ContextType, RequireFields<MutationUpdatePaymentMethodArgs, 'input' | 'payId'>>;
  updateProductFoods?: Resolver<Maybe<ResolversTypes['ResponseProduct']>, ParentType, ContextType, Partial<MutationUpdateProductFoodsArgs>>;
  updateRolesPriority?: Resolver<Maybe<ResolversTypes['UpdateRoleResponse']>, ParentType, ContextType, RequireFields<MutationUpdateRolesPriorityArgs, 'roles'>>;
  updateStoreTable?: Resolver<Maybe<ResolversTypes['TableResponse']>, ParentType, ContextType, RequireFields<MutationUpdateStoreTableArgs, 'tableId'>>;
  updatedCatWithProducts?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, Partial<MutationUpdatedCatWithProductsArgs>>;
  updatedProducts?: Resolver<Maybe<ResolversTypes['ResponseCategoryProduct']>, ParentType, ContextType, Partial<MutationUpdatedProductsArgs>>;
};

export type OrderPapuResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderPapu'] = ResolversParentTypes['OrderPapu']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pdpId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalProductsPrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  unidProducts?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type OrderStatusResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderStatusResponse'] = ResolversParentTypes['OrderStatusResponse']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderStatusType']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type OrderStatusTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderStatusType'] = ResolversParentTypes['OrderStatusType']> = {
  backgroundColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  idStatus?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type OrderTotalsResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderTotals'] = ResolversParentTypes['OrderTotals']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type PaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']> = {
  currentPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalPages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalRecords?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type PaymentMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethod'] = ResolversParentTypes['PaymentMethod']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  icon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  paymentPriority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PrintSaleTicketResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PrintSaleTicketResponse'] = ResolversParentTypes['PrintSaleTicketResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type ProductFoodResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductFood'] = ResolversParentTypes['ProductFood']> = {
  ExtProductFoodOptional?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFoodOptional']>>>, ParentType, ContextType>;
  ExtProductFoodsAll?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFood']>>>, ParentType, ContextType>;
  ProAssurance?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProBarCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProDelivery?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ProDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProDescuento?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ProHeight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ProImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProLength?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProOutstanding?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ProPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ProProtegido?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ProQuantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ProStar?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ProUniDisponibles?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProVoltaje?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProWeight?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProWidth?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ValueDelivery?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  area?: Resolver<Maybe<Array<Maybe<ResolversTypes['Area']>>>, ParentType, ContextType>;
  cId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  caId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  carProId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  colorId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  ctId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  dId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  fId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  feat?: Resolver<Maybe<Array<Maybe<ResolversTypes['Feature']>>>, ParentType, ContextType>;
  free?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  getAllAvailableProduct?: Resolver<Maybe<Array<Maybe<ResolversTypes['AvailableProduct']>>>, ParentType, ContextType>;
  getOneTags?: Resolver<Maybe<ResolversTypes['TagsProduct']>, ParentType, ContextType>;
  getStore?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  manageStock?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  pCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  product_availables?: Resolver<Maybe<Array<Maybe<ResolversTypes['AvailableProduct']>>>, ParentType, ContextType>;
  sTateLogistic?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  sizeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  stock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tgId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  tpId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  vat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type ProductFoodsResultAllResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductFoodsResultAll'] = ResolversParentTypes['ProductFoodsResultAll']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductFood']>>>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  ExtProductFoodsAll?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFood']>>>, ParentType, ContextType, Partial<QueryExtProductFoodsAllArgs>>;
  ExtProductFoodsLogis?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFood']>>>, ParentType, ContextType, Partial<QueryExtProductFoodsLogisArgs>>;
  ExtProductFoodsOne?: Resolver<Maybe<ResolversTypes['ExtProductFood']>, ParentType, ContextType, Partial<QueryExtProductFoodsOneArgs>>;
  ExtProductFoodsOptionalAll?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFoodOptional']>>>, ParentType, ContextType, Partial<QueryExtProductFoodsOptionalAllArgs>>;
  ExtProductFoodsOptionalOne?: Resolver<Maybe<ResolversTypes['ExtProductFoodOptional']>, ParentType, ContextType, Partial<QueryExtProductFoodsOptionalOneArgs>>;
  ExtProductFoodsSubOptionalAll?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFoodSubOptional']>>>, ParentType, ContextType, Partial<QueryExtProductFoodsSubOptionalAllArgs>>;
  ExtProductFoodsSubOptionalOne?: Resolver<Maybe<ResolversTypes['ExtProductFoodSubOptional']>, ParentType, ContextType, Partial<QueryExtProductFoodsSubOptionalOneArgs>>;
  areas?: Resolver<Maybe<Array<Maybe<ResolversTypes['Area']>>>, ParentType, ContextType, RequireFields<QueryAreasArgs, 'umId'>>;
  catProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['catProducts']>>>, ParentType, ContextType>;
  catProductsAll?: Resolver<Maybe<Array<Maybe<ResolversTypes['catProducts']>>>, ParentType, ContextType, Partial<QueryCatProductsAllArgs>>;
  catProductsLogis?: Resolver<Maybe<Array<Maybe<ResolversTypes['catProducts']>>>, ParentType, ContextType, Partial<QueryCatProductsLogisArgs>>;
  catProductsOne?: Resolver<Maybe<ResolversTypes['catProducts']>, ParentType, ContextType, Partial<QueryCatProductsOneArgs>>;
  cities?: Resolver<Maybe<Array<Maybe<ResolversTypes['City']>>>, ParentType, ContextType, RequireFields<QueryCitiesArgs, 'dId'>>;
  countries?: Resolver<Maybe<Array<Maybe<ResolversTypes['Country']>>>, ParentType, ContextType>;
  currentNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  dashboardComponent?: Resolver<Maybe<ResolversTypes['DashboardComponent']>, ParentType, ContextType, RequireFields<QueryDashboardComponentArgs, 'id'>>;
  dashboardComponents?: Resolver<Maybe<Array<Maybe<ResolversTypes['DashboardComponent']>>>, ParentType, ContextType>;
  department?: Resolver<Maybe<Array<Maybe<ResolversTypes['Department']>>>, ParentType, ContextType>;
  departments?: Resolver<Maybe<Array<Maybe<ResolversTypes['Department']>>>, ParentType, ContextType, RequireFields<QueryDepartmentsArgs, 'cId'>>;
  features?: Resolver<Maybe<Array<Maybe<ResolversTypes['Feature']>>>, ParentType, ContextType>;
  getAllAvailableProduct?: Resolver<Maybe<Array<Maybe<ResolversTypes['AvailableProduct']>>>, ParentType, ContextType, Partial<QueryGetAllAvailableProductArgs>>;
  getAllCatStore?: Resolver<Maybe<Array<Maybe<ResolversTypes['CatStore']>>>, ParentType, ContextType>;
  getAllCatStoreRecommended?: Resolver<Maybe<Array<Maybe<ResolversTypes['CatStore']>>>, ParentType, ContextType>;
  getAllClients?: Resolver<Maybe<ResolversTypes['ResponseClients']>, ParentType, ContextType, Partial<QueryGetAllClientsArgs>>;
  getAllModules?: Resolver<Maybe<Array<Maybe<ResolversTypes['Module']>>>, ParentType, ContextType>;
  getAllOrderStatusTypes?: Resolver<Maybe<ResolversTypes['ResponseAllOrderStatusTypes']>, ParentType, ContextType>;
  getAllPaymentMethods?: Resolver<Maybe<Array<Maybe<ResolversTypes['PaymentMethod']>>>, ParentType, ContextType>;
  getAllSalesStore?: Resolver<Maybe<Array<Maybe<ResolversTypes['StoreOrders']>>>, ParentType, ContextType>;
  getAllShoppingCart?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShoppingCart']>>>, ParentType, ContextType>;
  getAllStore?: Resolver<Maybe<Array<Maybe<ResolversTypes['Store']>>>, ParentType, ContextType, Partial<QueryGetAllStoreArgs>>;
  getAllTags?: Resolver<Maybe<ResolversTypes['ResponseAllTags']>, ParentType, ContextType, Partial<QueryGetAllTagsArgs>>;
  getAreas?: Resolver<Maybe<Array<Maybe<ResolversTypes['Area']>>>, ParentType, ContextType>;
  getCatProductsWithProduct?: Resolver<Maybe<ResolversTypes['customTotalAndCatProductsWithProduct']>, ParentType, ContextType, Partial<QueryGetCatProductsWithProductArgs>>;
  getCatProductsWithProductClient?: Resolver<Maybe<Array<Maybe<ResolversTypes['catProductsWithProduct']>>>, ParentType, ContextType, Partial<QueryGetCatProductsWithProductClientArgs>>;
  getCities?: Resolver<Maybe<Array<Maybe<ResolversTypes['City']>>>, ParentType, ContextType>;
  getDeviceUser?: Resolver<Maybe<ResolversTypes['DeviceUser']>, ParentType, ContextType, Partial<QueryGetDeviceUserArgs>>;
  getDeviceUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['DeviceUser']>>>, ParentType, ContextType>;
  getLocalBackendIp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  getMinPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType, Partial<QueryGetMinPriceArgs>>;
  getOneCatStore?: Resolver<Maybe<ResolversTypes['CatStore']>, ParentType, ContextType, Partial<QueryGetOneCatStoreArgs>>;
  getOneClients?: Resolver<Maybe<ResolversTypes['Clients']>, ParentType, ContextType, Partial<QueryGetOneClientsArgs>>;
  getOneCountry?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, Partial<QueryGetOneCountryArgs>>;
  getOneDepartment?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType, Partial<QueryGetOneDepartmentArgs>>;
  getOneSalesStore?: Resolver<Maybe<ResolversTypes['ResponseSalesStore']>, ParentType, ContextType, Partial<QueryGetOneSalesStoreArgs>>;
  getOneStoreSchedules?: Resolver<Maybe<ResolversTypes['StoreSchedule']>, ParentType, ContextType, Partial<QueryGetOneStoreSchedulesArgs>>;
  getOneTags?: Resolver<Maybe<ResolversTypes['TagsProduct']>, ParentType, ContextType, Partial<QueryGetOneTagsArgs>>;
  getOrderStatusTypeById?: Resolver<Maybe<ResolversTypes['OrderStatusType']>, ParentType, ContextType, RequireFields<QueryGetOrderStatusTypeByIdArgs, 'idStatus'>>;
  getPaymentMethod?: Resolver<Maybe<ResolversTypes['PaymentMethod']>, ParentType, ContextType, RequireFields<QueryGetPaymentMethodArgs, 'payId'>>;
  getProductFoods?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductFood']>>>, ParentType, ContextType>;
  getRole?: Resolver<ResolversTypes['Roles'], ParentType, ContextType, Partial<QueryGetRoleArgs>>;
  getRoles?: Resolver<Maybe<ResolversTypes['ResponseRoles']>, ParentType, ContextType, Partial<QueryGetRolesArgs>>;
  getSalesAmountToday?: Resolver<ResolversTypes['SalesAmountTodayResponse'], ParentType, ContextType>;
  getStore?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType, Partial<QueryGetStoreArgs>>;
  getStoreSchedules?: Resolver<Maybe<Array<Maybe<ResolversTypes['StoreSchedule']>>>, ParentType, ContextType, Partial<QueryGetStoreSchedulesArgs>>;
  getTodaySales?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryGetUserArgs>>;
  getUserByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByEmailArgs, 'email'>>;
  getcatProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['catProducts']>>>, ParentType, ContextType>;
  module?: Resolver<Maybe<ResolversTypes['Module']>, ParentType, ContextType>;
  modules?: Resolver<Maybe<Array<Maybe<ResolversTypes['Module']>>>, ParentType, ContextType>;
  productFoods?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductFood']>>>, ParentType, ContextType>;
  productFoodsAll?: Resolver<Maybe<ResolversTypes['ProductFoodsResultAll']>, ParentType, ContextType, Partial<QueryProductFoodsAllArgs>>;
  productFoodsLogis?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductFood']>>>, ParentType, ContextType, Partial<QueryProductFoodsLogisArgs>>;
  productFoodsOne?: Resolver<Maybe<ResolversTypes['ProductFood']>, ParentType, ContextType, Partial<QueryProductFoodsOneArgs>>;
  storeTable?: Resolver<Maybe<ResolversTypes['StoreTable']>, ParentType, ContextType, RequireFields<QueryStoreTableArgs, 'tableId'>>;
  storeTables?: Resolver<Maybe<Array<Maybe<ResolversTypes['StoreTable']>>>, ParentType, ContextType>;
  subModule?: Resolver<Maybe<ResolversTypes['SubModule']>, ParentType, ContextType>;
  subModules?: Resolver<Maybe<Array<Maybe<ResolversTypes['SubModule']>>>, ParentType, ContextType>;
  typeFeatures?: Resolver<Maybe<Array<Maybe<ResolversTypes['TypeFeature']>>>, ParentType, ContextType>;
};

export type RegisterBannerResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegisterBannerResponse'] = ResolversParentTypes['RegisterBannerResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type ResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Response'] = ResolversParentTypes['Response']> = {
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseAllOrderStatusTypesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseAllOrderStatusTypes'] = ResolversParentTypes['ResponseAllOrderStatusTypes']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderStatusType']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseAllTagsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseAllTags'] = ResolversParentTypes['ResponseAllTags']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['TagsProduct']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseAvailableProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseAvailableProduct'] = ResolversParentTypes['ResponseAvailableProduct']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['AvailableProduct']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseCategoryProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseCategoryProduct'] = ResolversParentTypes['ResponseCategoryProduct']> = {
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseClient'] = ResolversParentTypes['ResponseClient']> = {
  data?: Resolver<Maybe<ResolversTypes['Clients']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseClientsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseClients'] = ResolversParentTypes['ResponseClients']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['Clients']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseDashboardComponentResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseDashboardComponent'] = ResolversParentTypes['ResponseDashboardComponent']> = {
  data?: Resolver<Maybe<ResolversTypes['DashboardComponent']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseExtProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseExtProduct'] = ResolversParentTypes['ResponseExtProduct']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['ExtProductFood']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseExtProductFoodSubOptionalResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseExtProductFoodSubOptional'] = ResolversParentTypes['ResponseExtProductFoodSubOptional']> = {
  data?: Resolver<Maybe<ResolversTypes['ExtProductFoodSubOptional']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseMessageImageProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseMessageImageProduct'] = ResolversParentTypes['ResponseMessageImageProduct']> = {
  data?: Resolver<Maybe<ResolversTypes['IResponseData']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseOrderStatusTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseOrderStatusType'] = ResolversParentTypes['ResponseOrderStatusType']> = {
  data?: Resolver<Maybe<ResolversTypes['OrderStatusType']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseProduct'] = ResolversParentTypes['ResponseProduct']> = {
  data?: Resolver<Maybe<ResolversTypes['ProductFood']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseRolesResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseRoles'] = ResolversParentTypes['ResponseRoles']> = {
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['Roles']>>>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseSalesStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseSalesStore'] = ResolversParentTypes['ResponseSalesStore']> = {
  data?: Resolver<Maybe<ResolversTypes['StoreOrders']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseScheduleStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseScheduleStore'] = ResolversParentTypes['ResponseScheduleStore']> = {
  data?: Resolver<Maybe<ResolversTypes['StoreSchedule']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseShoppingCartResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseShoppingCart'] = ResolversParentTypes['ResponseShoppingCart']> = {
  data?: Resolver<Maybe<ResolversTypes['ShoppingCart']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type ResponseUploadLogoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResponseUploadLogo'] = ResolversParentTypes['ResponseUploadLogo']> = {
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type RolesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Roles'] = ResolversParentTypes['Roles']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  idRole?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type SalesAmountTodayResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SalesAmountTodayResponse'] = ResolversParentTypes['SalesAmountTodayResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type ShoppingCartResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShoppingCart'] = ResolversParentTypes['ShoppingCart']> = {
  cantProducts?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  comments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  getStore?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idUser?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  priceProduct?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  products?: Resolver<Maybe<ResolversTypes['ProductFood']>, ParentType, ContextType>;
  refCodePid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  shoppingCartId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  shoppingCartRefCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type StoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']> = {
  Image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ImageName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  NitStore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ULocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  Viaprincipal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addressStore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  banner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  catStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  cateStore?: Resolver<Maybe<ResolversTypes['CatStore']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['City']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  ctId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  dId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  dailyGoal?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  deliveryTimeMinutes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  department?: Resolver<Maybe<ResolversTypes['Department']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentIdentifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailStore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  getStoreSchedules?: Resolver<Maybe<Array<Maybe<ResolversTypes['StoreSchedule']>>>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  neighborhoodStore?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  open?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pais?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType>;
  scheduleOpenAll?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  secVia?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  siteWeb?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  socialRaz?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  storeName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  storeOwner?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  storePhone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  typeContribute?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  typeRegiments?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uPhoNum?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  upLat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  upLon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type StoreOrdersResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoreOrders'] = ResolversParentTypes['StoreOrders']> = {
  change?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  channel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  client?: Resolver<Maybe<ResolversTypes['Clients']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  getOneStore?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  locationUser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pCodeRef?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pSState?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  payId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  paymentMethod?: Resolver<Maybe<ResolversTypes['PaymentMethod']>, ParentType, ContextType>;
  pdpId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  ppState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  shoppingCartRefCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shoppingCarts?: Resolver<Maybe<Array<Maybe<ResolversTypes['ShoppingCart']>>>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  statusOrder?: Resolver<Maybe<ResolversTypes['OrderStatusType']>, ParentType, ContextType>;
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  totalProductsPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  totals?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderTotals']>>>, ParentType, ContextType>;
  unidProducts?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type StoreScheduleResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoreSchedule'] = ResolversParentTypes['StoreSchedule']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  schDay?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  schHoEnd?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schHoSta?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  schId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  schState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
};

export type StoreTableResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoreTable'] = ResolversParentTypes['StoreTable']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  seats?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tableId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tableName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tableState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type SubModuleResolvers<ContextType = any, ParentType extends ResolversParentTypes['SubModule'] = ResolversParentTypes['SubModule']> = {
  smIcon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  smName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  view?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  messageCreated?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "messageCreated", ParentType, ContextType, RequireFields<SubscriptionMessageCreatedArgs, 'chatId'>>;
  newStore?: SubscriptionResolver<Maybe<ResolversTypes['Store']>, "newStore", ParentType, ContextType>;
  numberIncremented?: SubscriptionResolver<Maybe<ResolversTypes['Int']>, "numberIncremented", ParentType, ContextType>;
};

export type TableResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TableResponse'] = ResolversParentTypes['TableResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['StoreTable']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type TagsProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagsProduct'] = ResolversParentTypes['TagsProduct']> = {
  aName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  idUser?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  nameTag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tgId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
};

export type TypeFeatureResolvers<ContextType = any, ParentType extends ResolversParentTypes['TypeFeature'] = ResolversParentTypes['TypeFeature']> = {
  thpDatCre?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thpDatMod?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thpIcon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thpId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  thpName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thpState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type UpdateModuleOrderPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateModuleOrderPayload'] = ResolversParentTypes['UpdateModuleOrderPayload']> = {
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modules?: Resolver<Maybe<Array<Maybe<ResolversTypes['Module']>>>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type UpdateRoleResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateRoleResponse'] = ResolversParentTypes['UpdateRoleResponse']> = {
  data?: Resolver<Maybe<ResolversTypes['Roles']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['errors']>>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  ULocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  associateStore?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idRole?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<Maybe<ResolversTypes['Roles']>, ParentType, ContextType>;
  siteWeb?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uPhoNum?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uState?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  upIdeDoc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  upLat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  upLon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type CatProductsResolvers<ContextType = any, ParentType extends ResolversParentTypes['catProducts'] = ResolversParentTypes['catProducts']> = {
  ProDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  carProId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type CatProductsWithProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['catProductsWithProduct'] = ResolversParentTypes['catProductsWithProduct']> = {
  ProDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ProImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  carProId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  idStore?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  pName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pState?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  productFoodsAll?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProductFood']>>>, ParentType, ContextType>;
  totalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type ContextErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['contextError'] = ResolversParentTypes['contextError']> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type CustomTotalAndCatProductsWithProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['customTotalAndCatProductsWithProduct'] = ResolversParentTypes['customTotalAndCatProductsWithProduct']> = {
  catProductsWithProduct?: Resolver<Maybe<Array<Maybe<ResolversTypes['catProductsWithProduct']>>>, ParentType, ContextType>;
  totalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type ErrorsResolvers<ContextType = any, ParentType extends ResolversParentTypes['errors'] = ResolversParentTypes['errors']> = {
  context?: Resolver<Maybe<ResolversTypes['contextError']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  path?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Area?: AreaResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  AvailableProduct?: AvailableProductResolvers<ContextType>;
  CatStore?: CatStoreResolvers<ContextType>;
  City?: CityResolvers<ContextType>;
  Clients?: ClientsResolvers<ContextType>;
  Country?: CountryResolvers<ContextType>;
  CreateRoleResponse?: CreateRoleResponseResolvers<ContextType>;
  DashboardComponent?: DashboardComponentResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Department?: DepartmentResolvers<ContextType>;
  DeviceUser?: DeviceUserResolvers<ContextType>;
  DeviceUserResponse?: DeviceUserResponseResolvers<ContextType>;
  ExtProductFood?: ExtProductFoodResolvers<ContextType>;
  ExtProductFoodOptional?: ExtProductFoodOptionalResolvers<ContextType>;
  ExtProductFoodSubOptional?: ExtProductFoodSubOptionalResolvers<ContextType>;
  Feature?: FeatureResolvers<ContextType>;
  IResponseData?: IResponseDataResolvers<ContextType>;
  IResponseMultipleTag?: IResponseMultipleTagResolvers<ContextType>;
  IResponseTag?: IResponseTagResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Module?: ModuleResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OrderPapu?: OrderPapuResolvers<ContextType>;
  OrderStatusResponse?: OrderStatusResponseResolvers<ContextType>;
  OrderStatusType?: OrderStatusTypeResolvers<ContextType>;
  OrderTotals?: OrderTotalsResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  PaymentMethod?: PaymentMethodResolvers<ContextType>;
  PrintSaleTicketResponse?: PrintSaleTicketResponseResolvers<ContextType>;
  ProductFood?: ProductFoodResolvers<ContextType>;
  ProductFoodsResultAll?: ProductFoodsResultAllResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegisterBannerResponse?: RegisterBannerResponseResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  ResponseAllOrderStatusTypes?: ResponseAllOrderStatusTypesResolvers<ContextType>;
  ResponseAllTags?: ResponseAllTagsResolvers<ContextType>;
  ResponseAvailableProduct?: ResponseAvailableProductResolvers<ContextType>;
  ResponseCategoryProduct?: ResponseCategoryProductResolvers<ContextType>;
  ResponseClient?: ResponseClientResolvers<ContextType>;
  ResponseClients?: ResponseClientsResolvers<ContextType>;
  ResponseDashboardComponent?: ResponseDashboardComponentResolvers<ContextType>;
  ResponseExtProduct?: ResponseExtProductResolvers<ContextType>;
  ResponseExtProductFoodSubOptional?: ResponseExtProductFoodSubOptionalResolvers<ContextType>;
  ResponseMessageImageProduct?: ResponseMessageImageProductResolvers<ContextType>;
  ResponseOrderStatusType?: ResponseOrderStatusTypeResolvers<ContextType>;
  ResponseProduct?: ResponseProductResolvers<ContextType>;
  ResponseRoles?: ResponseRolesResolvers<ContextType>;
  ResponseSalesStore?: ResponseSalesStoreResolvers<ContextType>;
  ResponseScheduleStore?: ResponseScheduleStoreResolvers<ContextType>;
  ResponseShoppingCart?: ResponseShoppingCartResolvers<ContextType>;
  ResponseUploadLogo?: ResponseUploadLogoResolvers<ContextType>;
  Roles?: RolesResolvers<ContextType>;
  SalesAmountTodayResponse?: SalesAmountTodayResponseResolvers<ContextType>;
  ShoppingCart?: ShoppingCartResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
  StoreOrders?: StoreOrdersResolvers<ContextType>;
  StoreSchedule?: StoreScheduleResolvers<ContextType>;
  StoreTable?: StoreTableResolvers<ContextType>;
  SubModule?: SubModuleResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TableResponse?: TableResponseResolvers<ContextType>;
  TagsProduct?: TagsProductResolvers<ContextType>;
  TypeFeature?: TypeFeatureResolvers<ContextType>;
  UpdateModuleOrderPayload?: UpdateModuleOrderPayloadResolvers<ContextType>;
  UpdateRoleResponse?: UpdateRoleResponseResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  catProducts?: CatProductsResolvers<ContextType>;
  catProductsWithProduct?: CatProductsWithProductResolvers<ContextType>;
  contextError?: ContextErrorResolvers<ContextType>;
  customTotalAndCatProductsWithProduct?: CustomTotalAndCatProductsWithProductResolvers<ContextType>;
  errors?: ErrorsResolvers<ContextType>;
};

