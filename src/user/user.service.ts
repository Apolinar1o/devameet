import {Injectable} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import { user,userDOcument } from "./schemas/user.schemas"
import { Model,} from "mongoose"
import { registerDto } from "./dtos/register.dto"
import * as CryptoJS from "crypto-js"
import { updateUSerDto } from "./dtos/updateUser.dto"





@Injectable()
export class Userservice {
    constructor(@InjectModel(user.name) private readonly userModel: Model<userDOcument>){}

    async create(dto: registerDto) {
        dto.senha = CryptoJS.AES.encrypt(dto.senha.toString(), process.env.USER_CYPHER_SECRET_KEY).toString()
        const createUser = new this.userModel(dto)
        await createUser.save()
        
    }

   

        async existsByemail(email: String) : Promise<boolean> {
        const result = await this.userModel.findOne({email})

        if(result) {
            return true
        } 
        return false
    }
     async getUserByLoginPassword(email: String, senha: String) : Promise<userDOcument | null> {
        const user = await this.userModel.findOne({email}) as userDOcument

        if(user) {
            const bytes  = CryptoJS.AES.decrypt(user.senha.toString(), process.env.USER_CYPHER_SECRET_KEY)
            const savedPassword = bytes.toString(CryptoJS.enc.Utf8)

            if(senha == savedPassword) {
                return user
            }
        }
        return null

        }
    async getUserById(id: string) {
        return await this.userModel.findById(id)

    }
    async updateUser(id: string, dto: updateUSerDto) {
        return await this.userModel.findByIdAndUpdate(id, dto)
    }
}
