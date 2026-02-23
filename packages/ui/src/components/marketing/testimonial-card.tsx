import * as React from "react";
import { Quote } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  avatarUrl,
  className,
}: TestimonialCardProps) {
  return (
    <Card className={cn("bg-card border shadow-sm", className)}>
      <CardContent className="pt-6">
        <Quote className="h-8 w-8 text-primary/20 mb-4" />
        <p className="text-lg italic text-foreground leading-relaxed mb-6">
          "{quote}"
        </p>
        <div className="flex items-center gap-4 border-t pt-4">
          <Avatar className="h-12 w-12 border border-muted">
            <AvatarImage src={avatarUrl} alt={author} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {author.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-foreground">{author}</h4>
            <p className="text-sm text-muted-foreground">
              {role}, <span className="text-foreground font-medium">{company}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
