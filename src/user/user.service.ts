import {Injectable} from "@nestjs/common"
import {InjectModel} from "@nestjs/mongoose"
import { user,userDOcument } from "./schemas/user.schemas"
import { Model,} from "mongoose"
import { registerDto } from "./dtos/register.dto"
import * as CryptoJS from "crypto-js"
import { Promise } from "mongoose"





@Injectable()
export class Userservice {
    constructor(@InjectModel(user.name) private readonly userModel: Model<userDOcument>){}

    async create(dto: registerDto) {
        dto.senha = CryptoJS.AES.encrypt(dto.senha.toString(), process.env.USER_CYPHER_SECRET_KEY).toString()
        console.log("-------------------------------------------")
        const createUser = new this.userModel(dto)
        console.log("-------------------------------------------")
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
                const bytes = CryptoJS.AES.decrypt(user.senha.toString(), process.env.USER_CYPHER_SECRET_KEY)
                const savedPassword = bytes.toString(CryptoJS.enc.Utf8)
                if(senha ==savedPassword) {
                    return user
                }
            }

        return null

    }
    async getUserByid(id:string) {
        console.log("----------------------------------------------------------------------")

        return await this.userModel.findById(id)
    }

    }

