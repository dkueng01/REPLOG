"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Plus, X } from "lucide-react"
import { exercises } from "@/mockedData/exercises"
import { muscleGroups } from "@/mockedData/muscleGroups"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export function ExercisesPage() {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMuscleGroup, setFilterMuscleGroup] = useState("")
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMuscleGroup = filterMuscleGroup === "" || exercise.muscleGroups.includes(filterMuscleGroup)
    return matchesSearch && matchesMuscleGroup
  })

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedMuscleGroups.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one muscle group.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Exercise added",
      description: "Your new exercise has been added to your library.",
    })
    setOpen(false)
    setSelectedMuscleGroups([])
  }

  const toggleMuscleGroup = (muscleGroup: string) => {
    setSelectedMuscleGroups((prev) =>
      prev.includes(muscleGroup) ? prev.filter((group) => group !== muscleGroup) : [...prev, muscleGroup],
    )
  }

  const removeMuscleGroup = (muscleGroup: string) => {
    setSelectedMuscleGroups((prev) => prev.filter((group) => group !== muscleGroup))
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Exercises</h1>
          <Dialog
            open={open}
            onOpenChange={(newOpen) => {
              setOpen(newOpen)
              if (!newOpen) setSelectedMuscleGroups([])
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddExercise}>
                <DialogHeader>
                  <DialogTitle>Add New Exercise</DialogTitle>
                  <DialogDescription>Create a new exercise for your workout plans.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Exercise name" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea id="description" placeholder="Brief description of the exercise" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Muscle Groups</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedMuscleGroups.map((group) => (
                        <Badge key={group} variant="secondary" className="flex items-center gap-1">
                          {group}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeMuscleGroup(group)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {group}</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {muscleGroups.map((group) => (
                        <div key={group} className="flex items-center space-x-2">
                          <Checkbox
                            id={`muscle-${group}`}
                            checked={selectedMuscleGroups.includes(group)}
                            onCheckedChange={() => toggleMuscleGroup(group)}
                          />
                          <Label htmlFor={`muscle-${group}`} className="text-sm cursor-pointer">
                            {group}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="default-sets">Default Sets</Label>
                      <Input id="default-sets" type="number" min="1" defaultValue="3" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rep-range">Rep Range</Label>
                      <Input id="rep-range" placeholder="e.g. 8-12" defaultValue="8-12" required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Add Exercise
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterMuscleGroup} onValueChange={setFilterMuscleGroup}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="All muscle groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All muscle groups</SelectItem>
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Image
                    src={exercise.image || "/placeholder.svg"}
                    alt={exercise.name}
                    width={400}
                    height={200}
                    className="aspect-video object-cover"
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4 gap-2">
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.map((group) => (
                      <Badge key={group} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm">
                    {exercise.defaultSets} sets × {exercise.repRange} reps
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
