/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	ChangeMyPasswordRequestDto:{

	},
	ChangePasswordRequestDto:{

	},
	CreateUserRequestDto:{
		role:"Role"
	},
	IdDto:{

	},
	LoginRequestDto:{

	},
	Mutation:{
		changeMyPassword:{
			data:"ChangeMyPasswordRequestDto"
		},
		changePassword:{
			data:"ChangePasswordRequestDto",
			where:"IdDto"
		},
		createUser:{
			data:"CreateUserRequestDto"
		},
		deleteUser:{
			where:"IdDto"
		},
		logIn:{
			data:"LoginRequestDto"
		},
		refreshToken:{
			data:"RefreshTokenRequestDto"
		},
		register:{
			data:"RegisterRequestDto"
		},
		updateMe:{
			data:"UpdateMeRequestDto"
		},
		updateUser:{
			data:"UpdateUserRequestDataDto",
			where:"IdDto"
		}
	},
	PaginationDto:{

	},
	Query:{
		readUsers:{
			pagination:"PaginationDto",
			sortBy:"SortByDto",
			where:"ReadUserWhereRequestDto"
		}
	},
	ReadUserWhereRequestDto:{
		role:"Role"
	},
	RefreshTokenRequestDto:{

	},
	RegisterRequestDto:{

	},
	Role: "enum" as const,
	SortByDto:{

	},
	UpdateMeRequestDto:{

	},
	UpdateUserRequestDataDto:{
		role:"Role"
	},
	ID: `scalar.ID` as const
}

export const ReturnTypes: Record<string,any> = {
	LoginResponseDto:{
		accessToken:"String",
		refreshToken:"String"
	},
	Mutation:{
		changeMyPassword:"SuccessDto",
		changePassword:"SuccessDto",
		createUser:"UserModel",
		deleteUser:"SuccessDto",
		logIn:"LoginResponseDto",
		logout:"SuccessDto",
		refreshToken:"LoginResponseDto",
		register:"LoginResponseDto",
		updateMe:"UserModel",
		updateUser:"UserModel"
	},
	Query:{
		me:"UserModel",
		readUsers:"ReadUserResponseDto"
	},
	ReadUserResponseDto:{
		count:"Int",
		data:"UserModel"
	},
	SuccessDto:{
		success:"Boolean"
	},
	UserModel:{
		active:"Boolean",
		id:"ID",
		name:"String",
		role:"Role",
		username:"String"
	},
	ID: `scalar.ID` as const
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}