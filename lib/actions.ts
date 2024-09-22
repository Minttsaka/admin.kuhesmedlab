"use server"

import { z } from "zod";
import { signJwt, verifyJwt } from "./jwt"
import { compileActivationTemplate, compileResetPassTemplate, sendMail } from "./mail"
import prisma from "./prisma"
import bcrypt from 'bcrypt';
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const FormSchema = z.object({
    name: z.string().min(2, "First name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    gender: z.enum(["MALE", "FEMALE"]),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    authority: z.string().min(2, "Role must be at least 2 characters"),
    country: z.string().min(2, "country must be at least 2 characters"),
    institution:  z.string().min(2, "country must be at least 2 characters"),
    age: z.string()
})

type FormData = z.infer<typeof FormSchema>;

export const deleteDepartment = async (id:string)=> {
    console.log("deleting")
    try {
        const dep = await prisma.department.delete({
            where:{
                id
            }
        })

        return `successfully deleted ${dep.name}`
    } catch (error) {
        return `failed to delete `
        
    }

}

export const deleteRole = async (departmentId:string , id:string)=> {

    console.log("deleting")

    try {
        const dep = await prisma.roles.delete({
            where:{
                departmentId,
                id
            }
        })

        return `successfully deleted ${dep.name}`
    } catch (error) {
        
    }

}

export const addMember = async (departmentId:string , data:FormData)=> {

    const {email,institution, ...rest}= data

    const password = generatePassword(12)

    const hashedPassword = await bcrypt.hash(password, 10);

   

    try {

      const alreadyUser = await prisma.user.findFirst(
        {
          where:{
            email
          }
        }
      )
  
      const existInstitution = await prisma.institution.findUnique({
        where:{
          id:institution
        }
      })

      const existDep = await prisma.department.findUnique({
        where:{
          id:departmentId
        }
      })
  
      if(alreadyUser) return "The email address has been used by another person."


        const newUser = await prisma.user.create({
            data: {
                ...rest,
                email,
                role:"ADMIN",
                password:hashedPassword,
                institution:{
                connect:{
                  id:existInstitution?.id
                }
              },
              departments:{
                connect:{
                  id:existDep?.id
                }
              }
            },
          });
      
          const jwtUserId = signJwt({
            id: newUser.id,
          });
      
          const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
          const body = compileActivationTemplate(newUser.name, activationUrl, password);
          await sendMail({ to: newUser.email, subject: "Activate Your Account", body });
      
          await prisma.notification.create({
            data: {
              to:{
                connect:{
                  id:newUser.id
                }
              },
              senderId:existInstitution?.name!,
              from:"KUHESMEDLAB",
              title:"Welcome to KUHESMEDLAB!",
              description:"a warm welcome to you",
              status: 'UNREAD',
              content:`<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; color: #333;">
                  <h1 style="font-size: 24px; color: #4a90e2; text-align: center; margin-bottom: 20px;">Welcome to kuhesmedlab!</h1>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Hello <strong>${newUser.name}</strong>,
                  </p>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    We're excited to have you on board! Here at Kuhesmedlab, we are dedicated to helping you succeed in your journey. To get started, we have put together some useful links and resources just for you.
                  </p>
                  
                  <a href="[Link to Getting Started Guide]" style="display: inline-block; background-color: #4a90e2; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 16px; margin-bottom: 20px; text-align: center;">Get Started</a>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                    If you have any questions, feel free to reach out to our support team at any time.
                  </p>
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #888; margin-top: 30px; text-align: center;">
                    Best Regards,<br>
                    The Kuhesmedlab Team
                  </p>
                </div>
                `
            },
          });

          if(newUser) {
            return `successfully added ${newUser.id}`
          }

        
    } catch (error) {
        
    }

}

function generatePassword(length: number = 12): string {
    if (length < 4) {
        throw new Error("Password length must be at least 4 characters to include all character types.");
    }

    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allCharacters = upper + lower + digits + special;

    let password = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        digits[Math.floor(Math.random() * digits.length)],
        special[Math.floor(Math.random() * special.length)]
    ];

    for (let i = 4; i < length; i++) {
        password.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
}


type ActivateUserFunc = {
  jwtUserId: string

}


export const activateUser = async (jwtUserID: ActivateUserFunc) => {
  const payload = verifyJwt(jwtUserID as any);
  const userId = payload?.id;

  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }
    
  });

  if (!user) return {status:"failed",data:"userNotExist"};;
  if (user.emailVerified) return {status:"failed",data:"alreadyActivated"};;

  const result = await prisma.user.update({
    where:{
      id:userId
    },
    data:{
      emailVerified: new Date(),
    }
    
  });

  if (result) {
    return { 
      status:"success",
      data:user.name
    };
  } else {

    return {
      status:"failed",
      data:"failed"
    };
  }
};

export async function forgotPassword(email: string) {

  const user = await prisma.user.findFirst({
    where:{
      email
    }
    
  });

  if (!user) throw new Error("The User Does Not Exist!");

  //  Send Email with Password Reset Link
  const jwtUserId = signJwt({
    id: user.id,
  });
  const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/resetPass/${jwtUserId}`;
  const body = compileResetPassTemplate(user.name, resetPassUrl);
  const sendResult = await sendMail({
    to: user.email,
    subject: "Reset Password",
    body: body,
  });
  return sendResult;
}

type ResetPasswordFucn = (
  jwtUserId: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const resetPassword: ResetPasswordFucn = async (jwtUserId, password) => {
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "userNotExist";
  const userId = payload.id;

  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }, 
  });

  if (!user) return "userNotExist";

  const result = await prisma.user.update(
    {
      where:{
        id:userId
    },
      data:{
        password: await bcrypt.hash(password, 10),
      }
  }
     
  );

  if (result) return "success";
  else throw new Error("Something went wrong!");
};


const contentTypes = ['BLOG', 'ANNOUNCEMENT', 'DISCOVERY', 'EVENT', 'SUPPORT'] as const
type ContentType = typeof contentTypes[number]
type Content ={
  title:string,
  image:string,
  category:string,
  body:string,
  slug:string,
  type:ContentType
}

export const saveContent = async(data:Content)=>{


  const session:any = await getServerSession(authOptions);
  const sessionUser= session.user as User
  try {

    const user = await prisma.user.findUnique({
      where:{
        id:sessionUser.id
      }
    })
    const newContent = await prisma.content.create({
      data:{
        ...data,
        creatorId:user?.id!,
        updatedAt:new Date(),
        creatorImage:user?.image! ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQleJQOJEcEoPn3WdR2navJFuJOYed8MGf-gQ&s",
        creatorName:user?.name!,
        creatorRole:user?.authority!
      }
    })

    console.log("saved")

    if(newContent){
      return newContent
    } 
    
  } catch (error) {

    console.log(error)
    
  }
}

export const publishContent = async(id:string)=>{
  
  try {

    await prisma.content.update({
      where:{
        id
      },
      data:{
        publishedAt:new Date()
      }
    })
    
    return "Success"
  } catch (error) {
    if(error){
      return "failed"
    }
    
  }



}

type SurveyData ={
  title:string ,
  description:string, 
  researchId:string, 
  label:string
}

export const saveSurveyData = async(data:SurveyData)=>{

  const {title ,description, researchId, label} = data

  const session:any = await getServerSession(authOptions);
  const sessionUser= session.user as User
  try {

    const research = await prisma.research.findUnique({
      where:{
          id:researchId
      }
    });

    const user = await prisma.user.findUnique({
      where:{
        id:sessionUser.id
      }
    })

  if(!research) throw new Error("You have to loggin in first. This an unauthorized operation")

    const existLabel = await prisma.survey.findFirst({
      where:{
        label,
        creatorId:user?.id
      }
    })

    if(existLabel){
      return "label"
    }

  const newSurvey = await prisma.survey.create({
      data:{
          title,
          creatorId:user?.id,
          creatorName:user?.name!,
          description,
          label,
          research: {
              connect: {
                id: research.id,
              },
          }

      }
  })

  return newSurvey
    
  } catch (error) {
    if(error){
    console.log(error)
    return "failed"
    }
    
  }

}

export const getResearchTrends = async (researchId: string) => {
  const citationTrends = await prisma.citationTrend.findMany({
    where: { researchId },
    orderBy: [
      { year: 'desc' },
      { month: 'desc' }
    ]
  });

  const downloadTrends = await prisma.downloadTrend.findMany({
    where: { researchId },
     orderBy: [
      { year: 'desc' },
      { month: 'desc' }
    ]
  });

  const research = await prisma.research.findUnique({
    where: { id: researchId },
    select: {
      citationTrend: true,
      downloadTrend: true,
      subjectAreas:true,
      views:true
    },
  });

  if (!research) {
    throw new Error("Research not found");
  }


  return { 
    citationTrends, 
    downloadTrends ,
    views:research.views,
    subjectAreaData:research.subjectAreas,
    citations: research.citationTrend.reduce((sum, citation) => sum + citation.citations, 0),
    downloads: research.downloadTrend.reduce((sum, download) => sum + download.downloads, 0), 
  };
}

export const createSupport = async(data:any)=>{

  console.log(data)

  try {

    const { slug } = data

    const existSupport = await prisma.support.findUnique({
      where:{
        slug
      }
    })

    if(existSupport){

      const update = await prisma.support.update({
        where:{
          slug
        }, 
        data
      })
      
      return existSupport.slug

    } else {

    const newSupport = await prisma.support.create({
      data
    })

    console.log(newSupport)

    return newSupport.slug
  }
    
  } catch (error) {
    console.log(error)
  }
}

export const supportDelete = async(id:string)=>{

  console.log(id)
  try {
    await prisma.support.delete({
      where:{
        id
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export async function markAsReads(id:string) {

  console.log(id)
  try {

    const notifications = await prisma.notification.update({
      where:{
        id
      },
      data:{
        status:"READ",
        readAt:new Date()
      }
    })

    console.log("marked as red single")

    if (!notifications) {
      throw new Error("Form not found");
    }

    return true

  } catch (error: any) {
    console.error("Error creating form:", error);
    return false
  }
}

export async function markAllAsReads() {

  const session:any = await getServerSession(authOptions);
  const userSession= (session.user as User);
  try {

    const notifications = await prisma.notification.updateMany({
      where:{
        receiverId:userSession.id
      },
      data:{
        status:"READ",
        readAt:new Date()
      }
    })

    console.log("marked as red all")

    if (!notifications) {
      throw new Error("Form not found");
    }

    return "success"

  } catch (error: any) {
    console.error("Error creating form:", error);
    return false
  }
}

export async function deleteNotification(id:string) {

  try {

    await prisma.notification.delete({
      where:{
        id
      },
      
    })


    return "success"

  } catch (error: any) {
    console.error("Error creating form:", error);
    return false
  }
}

export async function changeRole(id:string, data:any) {

  try {

    await prisma.user.update({
      where:{
        id
      },
      data
    })


    return "success"

  } catch (error: any) {
    console.error("Error creating form:", error);
    return false
  }
}

export async function changReadCount(id:string) {

  try {

    await prisma.chat.update({
      where: { id },
      data: { unreadCount: 0 }
    })


    return "success"

  } catch (error: any) {
    console.error("Error creating form:", error);
    return false
  }
}




