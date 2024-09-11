'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { createSupport } from '@/lib/actions';
import { useToast } from './ui/use-toast';
import { Support } from '@prisma/client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SupportTopics({ topics }: { topics: Support[] }) {
  const [newTopicTitle, setNewTopicTitle] = useState<{ title: string; slug: string | null }>({
    title: '',
    slug: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTopicTitle((prev) => ({
      ...prev,
      title: e.target.value, // Update only the title while preserving other properties
    }));
  };

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleSubmit = async () => {
    const generatedSlug = slugify(newTopicTitle.title);

    if (!generatedSlug) {
      toast({
        title: 'Error',
        description: 'Please enter a valid title to generate a slug.',
      });
      return;
    }

    setNewTopicTitle((prev) => ({
      ...prev,
      slug: generatedSlug,
    }));

    try {
      setIsSubmit(true);
      const res = await createSupport({ ...newTopicTitle, slug: generatedSlug });
      toast({
        title: 'Success',
        description: 'New topic created successfully.',
      });
      router.push(`/a/support/edit/${res}`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating the topic.',
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Topics</h1>
        <p className="text-gray-600">Browse support topics or create a new one</p>
      </header>

      <Accordion type="single" collapsible className="w-full mb-8">
        {topics?.map((topic) => (
          <AccordionItem key={topic.id} value={`item-${topic.id}`}>
            <AccordionTrigger>
              {topic.title}{' '}
              <Link className="text-xs text-[blue] font-normal" href={`/a/support/edit/${topic.slug}`}>
                Edit
              </Link>
            </AccordionTrigger>
            <AccordionContent>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="prose prose-lg max-w-4xl mx-auto"
                dangerouslySetInnerHTML={{ __html: topic?.body! }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Create New Topic</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Support Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter topic title"
              value={newTopicTitle.title}
              onChange={handleCreateTopic}
            />
            <Button type="button" onClick={handleSubmit} disabled={isSubmit}>
              {isSubmit ? 'Creating...' : 'Create and Edit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
