import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  const [
    newConsultations,
    contactedConsultations,
    articles,
    publishedArticles,
    portfolioItems,
    services,
    teamMembers,
    testimonials,
  ] = await Promise.all([
    db.consultationRequest.count({ where: { status: "new" } }),
    db.consultationRequest.count({ where: { status: "contacted" } }),
    db.article.count(),
    db.article.count({ where: { published: true } }),
    db.portfolioItem.count(),
    db.service.count(),
    db.teamMember.count(),
    db.testimonial.count({ where: { approved: true } }),
  ]);

  const recentConsultations = await db.consultationRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      fullName: true,
      serviceType: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    stats: {
      newConsultations,
      contactedConsultations,
      totalConsultations: newConsultations + contactedConsultations,
      articles,
      publishedArticles,
      portfolioItems,
      services,
      teamMembers,
      testimonials,
    },
    recentConsultations,
  });
}
