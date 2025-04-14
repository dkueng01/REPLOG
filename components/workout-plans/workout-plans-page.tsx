"use client"

import type React from "react"

import { useState } from "react"
import { Pencil, Plus } from "lucide-react"
import { exercises } from "@/mockedData/exercises"
import { workoutPlans } from "@/mockedData/workoutPlans"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { toast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function WorkoutPlansPage() {
  const [open, setOpen] = useState(false)
  const [planExercises, setPlanExercises] = useState<Array<{ exerciseId: string; sets: number; repRange: string }>>([])

  const getExerciseName = (id: string) => {
    const exercise = exercises.find((ex) => ex.id === id)
    return exercise ? exercise.name : "Unknown Exercise"
  }

  const getExerciseMuscleGroup = (id: string) => {
    const exercise = exercises.find((ex) => ex.id === id)
    return exercise ? exercise.muscleGroups[0] : "Unknown"
  }

  const handleAddExercise = () => {
    setPlanExercises([...planExercises, { exerciseId: "", sets: 3, repRange: "8-12" }])
  }

  const handleRemoveExercise = (index: number) => {
    setPlanExercises(planExercises.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (index: number, field: string, value: string | number) => {
    const updatedExercises = [...planExercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setPlanExercises(updatedExercises)
  }

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Workout plan created",
      description: "Your new workout plan has been created.",
    })
    setPlanExercises([])
    setOpen(false)
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Workout Plans</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleCreatePlan}>
                <DialogHeader>
                  <DialogTitle>Create Workout Plan</DialogTitle>
                  <DialogDescription>Build a new workout plan by adding exercises from your library.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="plan-name">Plan Name</Label>
                    <Input id="plan-name" placeholder="e.g. Push Day, Full Body, etc." required />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Exercises</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddExercise}
                        className="h-8 text-xs"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Exercise
                      </Button>
                    </div>

                    {planExercises.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No exercises added yet. Click "Add Exercise" to start building your plan.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {planExercises.map((exercise, index) => (
                          <div key={index} className="flex flex-col gap-3 p-3 border rounded-md">
                            <div className="flex items-center justify-between">
                              <Label>Exercise {index + 1}</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveExercise(index)}
                                className="h-8 text-xs text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                            <Select
                              value={exercise.exerciseId}
                              onValueChange={(value) => handleExerciseChange(index, "exerciseId", value)}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select exercise" />
                              </SelectTrigger>
                              <SelectContent>
                                {exercises.map((ex) => (
                                  <SelectItem key={ex.id} value={ex.id}>
                                    {ex.name} ({ex.muscleGroup})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="grid gap-1">
                                <Label htmlFor={`sets-${index}`} className="text-xs">
                                  Sets
                                </Label>
                                <Input
                                  id={`sets-${index}`}
                                  type="number"
                                  min="1"
                                  value={exercise.sets}
                                  onChange={(e) => handleExerciseChange(index, "sets", Number.parseInt(e.target.value))}
                                  required
                                />
                              </div>
                              <div className="grid gap-1">
                                <Label htmlFor={`rep-range-${index}`} className="text-xs">
                                  Rep Range
                                </Label>
                                <Input
                                  id={`rep-range-${index}`}
                                  value={exercise.repRange}
                                  onChange={(e) => handleExerciseChange(index, "repRange", e.target.value)}
                                  placeholder="e.g. 8-12"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Create Plan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workoutPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.exercises.length} exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="exercises">
                    <AccordionTrigger className="text-sm">View exercises</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {plan.exercises.map((exercise, index) => (
                          <div key={index} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{getExerciseName(exercise.exerciseId)}</span>
                              <Badge variant="outline">{getExerciseMuscleGroup(exercise.exerciseId)}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.repRange} reps
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="">
                    Edit Workout
                    <Pencil className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
