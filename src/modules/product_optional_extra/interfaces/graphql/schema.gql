# types
type ExtProductFood {
	pId: ID!
	exPid: ID
	exState: Int
	extraName: String
	extraPrice: Float
	quantity: Int
	newExtraPrice: Int
	state: Int
	createdAt: DateTime
	updatedAt: DateTime
}

# type OPTIONAL PRODUCT
type ExtProductFoodOptional {
	pId: ID!
	opExPid: ID
	OptionalProName: String
	state: Int
	code: String
	required: Int
	numbersOptionalOnly: Int
	createdAt: DateTime
	updatedAt: DateTime
	ExtProductFoodsSubOptionalAll: [ExtProductFoodSubOptional]
}

# type SUB_OPTIONAL PRODUCT
type ExtProductFoodSubOptional {
	pId: ID
	opExPid: ID
	idStore: ID
	opSubExPid: ID # main
	OptionalSubProName: String
	exCodeOptionExtra: String # Relación con ExtProductFoodOptional
	exCode: String # Relación con ExtProductFoodOptional
	state: Int
	createdAt: DateTime
	updatedAt: DateTime
}

input InputExtProductFoodSubOptional {
	pId: ID
	opExPid: ID
	idStore: ID
	opSubExPid: ID # main
	OptionalSubProName: String
	exCodeOptionExtra: String # Relación con ExtProductFoodOptional
	exCode: String # Relación con ExtProductFoodOptional
	state: Int
	createdAt: DateTime
	updatedAt: DateTime
}

# INPUT OPTIONAL
input InputExtProductFoodOptional {
	pId: ID
	opExPid: ID
	code: String
	OptionalProName: String
	state: Int
	required: Int
	numbersOptionalOnly: Int
}
# Inputs
input InputExtProductFood {
	pId: ID!
	exPid: ID
	exState: Int
	extraName: String
	extraPrice: Float
	state: Int
	createdAt: DateTime
	updatedAt: DateTime
}

input ILineItemsExtraFinal {
	setData: [InputExtProductFood]
}

input EditExtProductFoodOptionalInput {
	pId: ID!
	opExPid: ID
	OptionalProName: String
	state: Int
	code: String
	required: Int
	numbersOptionalOnly: Int
	updatedAt: DateTime
	ExtProductFoodsSubOptionalAll: [EditExtProductFoodSubOptionalInput]
}

input EditExtProductFoodSubOptionalInput {
	pId: ID
	opExPid: ID
	idStore: ID
	opSubExPid: ID
	OptionalSubProName: String
	exCodeOptionExtra: String
	exCode: String
	state: Int
}

# Queries
type Query {
	"Consulta todos los ExtProductFood"
	ExtProductFoodsOne(pId: ID, cId: ID, dId: ID, ctId: ID ): ExtProductFood
	ExtProductFoodsAll(pId: ID, cId: ID, dId: ID, ctId: ID, search: String, min: Int, max: Int  ): [ExtProductFood]
	ExtProductFoodsLogis(pId: ID, cId: ID, dId: ID, ctId: ID, search: String, min: Int, max: Int  ): [ExtProductFood]
	"Consulta todos los ExtProductFoodOptional"
	ExtProductFoodsOptionalAll(pId: ID, cId: ID, dId: ID, ctId: ID, search: String, min: Int, max: Int  ): [ExtProductFoodOptional]
	ExtProductFoodsOptionalOne(pId: ID, cId: ID, dId: ID, ctId: ID ): ExtProductFoodOptional
	"Consulta todos los ExtSubProductFoodOptional"
	ExtProductFoodsSubOptionalAll(pId: ID, cId: ID, dId: ID, ctId: ID, search: String, min: Int, max: Int  ): [ExtProductFoodSubOptional]
	ExtProductFoodsSubOptionalOne(pId: ID, cId: ID, dId: ID, ctId: ID ): ExtProductFoodSubOptional
}
