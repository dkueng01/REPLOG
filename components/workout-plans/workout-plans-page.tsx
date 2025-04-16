"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, Plus, Info } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WorkoutPlansPage() {
  const [open, setOpen] = useState(false)
  const [planExercises, setPlanExercises] = useState<
    Array<{
      exerciseId: string
      sets: number
      repRange: string
      earlyRPE: number
      lastRPE: number
      alternativeExerciseIds: string[]
      restTime: number
      warmupSets: number
    }>
  >([])

  const getExerciseName = (id: string) => {
    const exercise = exercises.find((ex) => ex.id === id)
    return exercise ? exercise.name : "Unknown Exercise"
  }

  const getExerciseMuscleGroups = (id: string) => {
    const exercise = exercises.find((ex) => ex.id === id)
    return exercise ? exercise.muscleGroups : ["Unknown"]
  }

  const handleAddExercise = () => {
    setPlanExercises([
      ...planExercises,
      {
        exerciseId: "",
        sets: 3,
        repRange: "8-12",
        earlyRPE: 7,
        lastRPE: 9,
        alternativeExerciseIds: ["", ""],
        restTime: 90,
        warmupSets: 1,
      },
    ])
  }

  const handleRemoveExercise = (index: number) => {
    setPlanExercises(planExercises.filter((_, i) => i !== index))
  }

  const handleExerciseChange = (index: number, field: string, value: string | number | string[]) => {
    const updatedExercises = [...planExercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setPlanExercises(updatedExercises)
  }

  const handleAlternativeChange = (exerciseIndex: number, altIndex: number, value: string) => {
    const updatedExercises = [...planExercises]
    const alternativeExerciseIds = [...updatedExercises[exerciseIndex].alternativeExerciseIds]
    alternativeExerciseIds[altIndex] = value
    updatedExercises[exerciseIndex].alternativeExerciseIds = alternativeExerciseIds
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

  const formatRestTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
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
                      <div className="space-y-6">
                        {planExercises.map((exercise, index) => (
                          <div key={index} className="flex flex-col gap-4 p-4 border rounded-md">
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-medium">Exercise {index + 1}</Label>
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

                            {/* Main Exercise */}
                            <div className="space-y-3">
                              <Label>Primary Exercise</Label>
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
                                      {ex.name} ({ex.muscleGroups.join(", ")})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Alternative Exercises */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Label>Alternative Exercises</Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                        <Info className="h-3 w-3" />
                                        <span className="sr-only">Alternative exercises info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-xs">
                                        These exercises can be substituted during a workout if needed.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <Label htmlFor={`alt1-${index}`} className="text-xs mb-1 block">
                                    Alternative 1
                                  </Label>
                                  <Select
                                    value={exercise.alternativeExerciseIds[0]}
                                    onValueChange={(value) => handleAlternativeChange(index, 0, value)}
                                  >
                                    <SelectTrigger id={`alt1-${index}`}>
                                      <SelectValue placeholder="Select alternative" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {exercises
                                        .filter(
                                          (ex) =>
                                            ex.id !== exercise.exerciseId &&
                                            ex.id !== exercise.alternativeExerciseIds[1],
                                        )
                                        .map((ex) => (
                                          <SelectItem key={ex.id} value={ex.id}>
                                            {ex.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`alt2-${index}`} className="text-xs mb-1 block">
                                    Alternative 2
                                  </Label>
                                  <Select
                                    value={exercise.alternativeExerciseIds[1]}
                                    onValueChange={(value) => handleAlternativeChange(index, 1, value)}
                                  >
                                    <SelectTrigger id={`alt2-${index}`}>
                                      <SelectValue placeholder="Select alternative" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {exercises
                                        .filter(
                                          (ex) =>
                                            ex.id !== exercise.exerciseId &&
                                            ex.id !== exercise.alternativeExerciseIds[0],
                                        )
                                        .map((ex) => (
                                          <SelectItem key={ex.id} value={ex.id}>
                                            {ex.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            {/* Sets and Reps */}
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

                            {/* Warmup Sets */}
                            <div className="grid gap-1">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`warmup-sets-${index}`} className="text-xs">
                                  Warmup Sets
                                </Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                        <Info className="h-3 w-3" />
                                        <span className="sr-only">Warmup sets info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-xs">
                                        Number of warmup sets to perform before your working sets. These help prepare
                                        your muscles and joints for heavier loads.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Select
                                value={exercise.warmupSets.toString()}
                                onValueChange={(value) => handleExerciseChange(index, "warmupSets", Number(value))}
                              >
                                <SelectTrigger id={`warmup-sets-${index}`}>
                                  <SelectValue placeholder="Select number of warmup sets" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[0, 1, 2, 3, 4, 5].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Rest Time */}
                            <div className="grid gap-1">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`rest-time-${index}`} className="text-xs">
                                  Rest Time
                                </Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                        <Info className="h-3 w-3" />
                                        <span className="sr-only">Rest time info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-xs">
                                        Rest time between sets in seconds. Shorter rest (30-90s) is better for
                                        hypertrophy, longer rest (2-5min) is better for strength.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <Select
                                value={exercise.restTime.toString()}
                                onValueChange={(value) => handleExerciseChange(index, "restTime", Number(value))}
                              >
                                <SelectTrigger id={`rest-time-${index}`}>
                                  <SelectValue placeholder="Select rest time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="30">30 seconds</SelectItem>
                                  <SelectItem value="60">1 minute</SelectItem>
                                  <SelectItem value="90">1.5 minutes</SelectItem>
                                  <SelectItem value="120">2 minutes</SelectItem>
                                  <SelectItem value="180">3 minutes</SelectItem>
                                  <SelectItem value="240">4 minutes</SelectItem>
                                  <SelectItem value="300">5 minutes</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* RPE Values */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label>RPE Targets</Label>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                        <Info className="h-3 w-3" />
                                        <span className="sr-only">RPE info</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="max-w-xs text-xs">
                                        Rate of Perceived Exertion (RPE) on a scale of 1-10. Early RPE is for your first
                                        sets, Last RPE is for your final set.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-1">
                                  <Label htmlFor={`early-rpe-${index}`} className="text-xs">
                                    Early RPE
                                  </Label>
                                  <Select
                                    value={exercise.earlyRPE.toString()}
                                    onValueChange={(value) => handleExerciseChange(index, "earlyRPE", Number(value))}
                                  >
                                    <SelectTrigger id={`early-rpe-${index}`}>
                                      <SelectValue placeholder="Select RPE" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[5, 6, 7, 8, 9].map((rpe) => (
                                        <SelectItem key={rpe} value={rpe.toString()}>
                                          {rpe}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-1">
                                  <Label htmlFor={`last-rpe-${index}`} className="text-xs">
                                    Last RPE
                                  </Label>
                                  <Select
                                    value={exercise.lastRPE.toString()}
                                    onValueChange={(value) => handleExerciseChange(index, "lastRPE", Number(value))}
                                  >
                                    <SelectTrigger id={`last-rpe-${index}`}>
                                      <SelectValue placeholder="Select RPE" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[6, 7, 8, 9, 10].map((rpe) => (
                                        <SelectItem key={rpe} value={rpe.toString()}>
                                          {rpe}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
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
                      <div className="space-y-4">
                        {plan.exercises.map((exercise, index) => (
                          <div key={index} className="flex flex-col gap-2 border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{getExerciseName(exercise.exerciseId)}</span>
                              <div className="flex flex-wrap gap-1 justify-end">
                                {getExerciseMuscleGroups(exercise.exerciseId).map((group) => (
                                  <Badge key={group} variant="outline" className="text-xs">
                                    {group}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.repRange} reps • RPE: {exercise.earlyRPE}-
                              {exercise.lastRPE}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Rest: {formatRestTime(exercise.restTime)} • Warmup sets: {exercise.warmupSets}
                            </div>
                            {exercise.alternativeExerciseIds.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                <span>Alternatives: </span>
                                {exercise.alternativeExerciseIds.map((altId, i) => (
                                  <span key={i}>
                                    {getExerciseName(altId)}
                                    {i < exercise.alternativeExerciseIds.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/active-workout">
                    Start Workout
                    <ChevronRight className="ml-2 h-4 w-4" />
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
