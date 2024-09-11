"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import "react-quill/dist/quill.bubble.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Support } from "@prisma/client";
import ReactQuill from "react-quill";
import { formats, modules } from "@/lib/quillModules";
import { createSupport, supportDelete } from "@/lib/actions";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

export default function SupportDashboard({ support }: { support: Support }) {
  const [title, setTitle] = useState(support?.title || "");
  const [value, setValue] = useState(support?.body || "");
  const [content, setContent] = useState<Support>(support);

  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, // Update only the relevant field
    }));
    setTitle(e.target.value); // Ensure title is also updated in the state
  };

  const saveChange = async () => {
    // Make sure the body is set before submission
    const updatedContent = { ...content, body: value };

    // Check if the body is not empty
    if (updatedContent.body && updatedContent.body.trim() !== "") {
      try {
        const { id, createdAt, ...rest } = updatedContent;
        await createSupport(rest);
        toast({
          title: "Status",
          description: "Success",
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      toast({
        title: "Body",
        description: "Please fill the content!",
      });
    }
  };

  const deleteSupport = async () => {
    try {
      await supportDelete(support.id);
      router.push("/a/support");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Page Dashboard</h1>
        <p className="text-gray-600">Create and manage support content</p>
      </header>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Support Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    placeholder="Enter support page title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <ReactQuill
                    className="h-[30vh] z-50 bg-gray-100 mx-2 placeholder:text-2xl outline-none"
                    theme="bubble"
                    modules={modules}
                    formats={formats}
                    value={value}
                    onChange={setValue}
                    placeholder="Tell your story..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={saveChange} type="button">
                    Save Changes
                  </Button>
                  <Button onClick={deleteSupport} className="bg-[red]" type="button">
                    Delete this content
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h1>{title || "Support Page Title"}</h1>
                <div dangerouslySetInnerHTML={{ __html: value }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
