import DashboardFirst from '@/components/DashboardFirst'
import { prisma } from '@/lib/prisma'
import React from 'react'

export default async function page() {

  const [ published, pending, activeSurvey, users, recentPapers, highCitations, events] = await prisma.$transaction([

    prisma.research.count({
      where:{
        status:"APPROVED"
      },
      
    }),
    prisma.research.findMany({
     where:{
      status:"PENDING"
     }   
    }),

    prisma.survey.count({
        where:{
          status:"active"
        }
    }),
    prisma.user.count(),
    prisma.research.findMany({
      orderBy:{
        createdAt:"desc"
      },
      include:{
        user:true
      },
      take:5
    }),
    prisma.research.findMany({
      include: {
        citationTrend: true,
      },
      orderBy: {
        citationTrend: {
          _count: 'desc',
        },
      },
      take: 5,
    }),
    prisma.event.findMany({
      orderBy:{
        createdAt:"desc"
      },
      take:3
    })
  ])


 const getPaperDataByMonth = async (year: number) => {
  const paperData = await prisma.research.groupBy({
    by: ["createdAt"],
    _count: {
      _all: true,
    },
    where: {
      createdAt: {
        gte: new Date(year, 0, 1), 
        lt: new Date(year + 1, 0, 1), 
      },
    },
  });


  const monthlyPaperData = Array(12).fill(0).map((_, index) => ({
    name: new Date(0, index).toLocaleString("default", { month: "short" }),
    papers: 0,
  }));

  paperData.forEach(({ createdAt, _count }) => {
    const monthIndex = new Date(createdAt).getMonth();
    monthlyPaperData[monthIndex].papers += _count._all;
  });

  return monthlyPaperData;
};

const currentYear = new Date().getFullYear();
const paperData = await getPaperDataByMonth(currentYear);


  return (
    <div>
      <DashboardFirst 
      events={events}
      published={published!} 
      pending={pending!} 
      activeSurvey={activeSurvey!} 
      user={users!}
      recentResearch={recentPapers!}
      highCitations={highCitations!}
      paperData={paperData!}
       />
    </div>
  )
}
