/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Role: "enum" as const,
	Query:{
		readUsers:{
			where:"ReadUserWhereRequestDto",
			pagination:"PaginationDto",
			sortBy:"SortByDto"
		}
	},
	ReadUserWhereRequestDto:{
		role:"Role"
	},
	PaginationDto:{

	},
	SortByDto:{

	},
	Mutation:{
		logIn:{
			data:"LoginRequestDto"
		},
		register:{
			data:"RegisterRequestDto"
		},
		changePassword:{
			data:"ChangePasswordRequestDto",
			where:"IdDto"
		},
		changeMyPassword:{
			data:"ChangeMyPasswordRequestDto"
		},
		refreshToken:{
			data:"RefreshTokenRequestDto"
		},
		updateMe:{
			data:"UpdateMeRequestDto"
		},
		createUser:{
			data:"CreateUserRequestDto"
		},
		updateUser:{
			data:"UpdateUserRequestDataDto",
			where:"IdDto"
		},
		deleteUser:{
			where:"IdDto"
		}
	},
	LoginRequestDto:{

	},
	RegisterRequestDto:{

	},
	ChangePasswordRequestDto:{

	},
	IdDto:{

	},
	ChangeMyPasswordRequestDto:{

	},
	RefreshTokenRequestDto:{

	},
	UpdateMeRequestDto:{

	},
	CreateUserRequestDto:{
		role:"Role"
	},
	UpdateUserRequestDataDto:{
		role:"Role"
	},
	ID: `scalar.ID` as const
}

export const ReturnTypes: Record<string,any> = {
	SuccessDto:{
		success:"Boolean"
	},
	LoginResponseDto:{
		accessToken:"String",
		refreshToken:"String"
	},
	UserModel:{
		id:"ID",
		name:"String",
		username:"String",
		active:"Boolean",
		role:"Role"
	},
	ReadUserResponseDto:{
		count:"Int",
		data:"UserModel"
	},
	Query:{
		me:"UserModel",
		readUsers:"ReadUserResponseDto"
	},
	Mutation:{
		logIn:"LoginResponseDto",
		register:"LoginResponseDto",
		logout:"SuccessDto",
		changePassword:"SuccessDto",
		changeMyPassword:"SuccessDto",
		refreshToken:"LoginResponseDto",
		updateMe:"UserModel",
		createUser:"UserModel",
		updateUser:"UserModel",
		deleteUser:"SuccessDto"
	},
	ID: `scalar.ID` as const
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}