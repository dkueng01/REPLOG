"use client"

import { useState } from "react"
import { ChevronLeft, Plus, Save } from "lucide-react"
import { exercises } from "@/mockedData/exercises"
import { workoutPlans } from "@/mockedData/workoutPlans"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface ExerciseSet {
  weight: number
  reps: number
}

interface ActiveExercise {
  exerciseId: string
  sets: ExerciseSet[]
}

export function ActiveWorkoutPage() {
  const [selectedPlanId, setSelectedPlanId] = useState("")
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>([])
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false)

  const handleSelectPlan = (planId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId)
    if (!plan) return

    const initialExercises = plan.exercises.map((exercise) => {
      const exerciseData = exercises.find((e) => e.id === exercise.exerciseId)
      const lastWeight = exerciseData?.lastWeight || 0

      return {
        exerciseId: exercise.exerciseId,
        sets: Array(exercise.sets)
          .fill(0)
          .map(() => ({
            weight: lastWeight,
            reps: 0,
          })),
      }
    })

    setActiveExercises(initialExercises)
    setSelectedPlanId(planId)
    setIsWorkoutStarted(true)
  }

  const handleAddSet = (exerciseIndex: number) => {
    const updatedExercises = [...activeExercises]
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1]
    updatedExercises[exerciseIndex].sets.push({ ...lastSet })
    setActiveExercises(updatedExercises)
  }

  const handleSetChange = (exerciseIndex: number, setIndex: number, field: "weight" | "reps", value: number) => {
    const updatedExercises = [...activeExercises]
    updatedExercises[exerciseIndex].sets[setIndex][field] = value
    setActiveExercises(updatedExercises)
  }

  const handleFinishWorkout = () => {
    toast({
      title: "Workout completed",
      description: "Your workout has been saved successfully.",
    })
    setIsWorkoutStarted(false)
    setSelectedPlanId("")
    setActiveExercises([])
  }

  const getExerciseDetails = (id: string) => {
    return exercises.find((ex) => ex.id === id)
  }

  const getRepRange = (exerciseId: string) => {
    const plan = workoutPlans.find((p) => p.id === selectedPlanId)
    if (!plan) return ""

    const exercise = plan.exercises.find((e) => e.exerciseId === exerciseId)
    return exercise ? exercise.repRange : ""
  }

  if (!isWorkoutStarted) {
    return (
      <AppShell>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Start Workout</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select a workout plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleSelectPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a workout plan" />
                </SelectTrigger>
                <SelectContent>
                  {workoutPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  const selectedPlan = workoutPlans.find((p) => p.id === selectedPlanId)

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{selectedPlan?.name}</h1>
          </div>
        </div>

        <div className="space-y-6">
          {activeExercises.map((exercise, exerciseIndex) => {
            const exerciseDetails = getExerciseDetails(exercise.exerciseId)
            const repRange = getRepRange(exercise.exerciseId)

            return (
              <Card key={exerciseIndex}>
                <CardHeader>
                  <CardTitle>{exerciseDetails?.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">{exerciseDetails?.muscleGroup}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-2 text-sm font-medium">Set {setIndex + 1}</div>
                        <div className="col-span-5">
                          <Label htmlFor={`weight-${exerciseIndex}-${setIndex}`} className="sr-only">
                            Weight
                          </Label>
                          <div className="relative">
                            <Input
                              id={`weight-${exerciseIndex}-${setIndex}`}
                              type="number"
                              value={set.weight || ""}
                              onChange={(e) =>
                                handleSetChange(exerciseIndex, setIndex, "weight", Number(e.target.value))
                              }
                              className="pr-8"
                              placeholder="0"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                              lbs
                            </div>
                          </div>
                        </div>
                        <div className="col-span-5">
                          <Label htmlFor={`reps-${exerciseIndex}-${setIndex}`} className="sr-only">
                            Reps
                          </Label>
                          <Input
                            id={`reps-${exerciseIndex}-${setIndex}`}
                            type="number"
                            value={set.reps || ""}
                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, "reps", Number(e.target.value))}
                            placeholder={repRange}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddSet(exerciseIndex)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Set
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <Separator />

        <Button className="w-full py-6 bg-orange-500 hover:bg-orange-600" onClick={handleFinishWorkout}>
          <Save className="mr-2 h-5 w-5" />
          Finish Workout
        </Button>
      </div>
    </AppShell>
  )
}
